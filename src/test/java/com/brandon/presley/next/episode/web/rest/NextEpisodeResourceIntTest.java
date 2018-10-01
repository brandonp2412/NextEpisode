package com.brandon.presley.next.episode.web.rest;

import com.brandon.presley.next.episode.NextEpisodeApp;

import com.brandon.presley.next.episode.domain.NextEpisode;
import com.brandon.presley.next.episode.repository.NextEpisodeRepository;
import com.brandon.presley.next.episode.repository.search.NextEpisodeSearchRepository;
import com.brandon.presley.next.episode.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;


import static com.brandon.presley.next.episode.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the NextEpisodeResource REST controller.
 *
 * @see NextEpisodeResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = NextEpisodeApp.class)
public class NextEpisodeResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final byte[] DEFAULT_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_IMAGE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_IMAGE_CONTENT_TYPE = "image/png";

    private static final Integer DEFAULT_EPISODE_NUMBER = 1;
    private static final Integer UPDATED_EPISODE_NUMBER = 2;

    private static final Integer DEFAULT_EPISODE_SEASON = 1;
    private static final Integer UPDATED_EPISODE_SEASON = 2;

    private static final LocalDate DEFAULT_EPISODE_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_EPISODE_DATE = LocalDate.now(ZoneId.systemDefault());


    @Autowired
    private NextEpisodeRepository nextEpisodeRepository;

    /**
     * This repository is mocked in the com.brandon.presley.next.episode.repository.search test package.
     *
     * @see com.brandon.presley.next.episode.repository.search.NextEpisodeSearchRepositoryMockConfiguration
     */
    @Autowired
    private NextEpisodeSearchRepository mockNextEpisodeSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restNextEpisodeMockMvc;

    private NextEpisode nextEpisode;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final NextEpisodeResource nextEpisodeResource = new NextEpisodeResource(nextEpisodeRepository, mockNextEpisodeSearchRepository);
        this.restNextEpisodeMockMvc = MockMvcBuilders.standaloneSetup(nextEpisodeResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static NextEpisode createEntity(EntityManager em) {
        NextEpisode nextEpisode = new NextEpisode()
            .name(DEFAULT_NAME)
            .image(DEFAULT_IMAGE)
            .imageContentType(DEFAULT_IMAGE_CONTENT_TYPE)
            .episodeNumber(DEFAULT_EPISODE_NUMBER)
            .episodeSeason(DEFAULT_EPISODE_SEASON)
            .episodeDate(DEFAULT_EPISODE_DATE);
        return nextEpisode;
    }

    @Before
    public void initTest() {
        nextEpisode = createEntity(em);
    }

    @Test
    @Transactional
    public void createNextEpisode() throws Exception {
        int databaseSizeBeforeCreate = nextEpisodeRepository.findAll().size();

        // Create the NextEpisode
        restNextEpisodeMockMvc.perform(post("/api/next-episodes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(nextEpisode)))
            .andExpect(status().isCreated());

        // Validate the NextEpisode in the database
        List<NextEpisode> nextEpisodeList = nextEpisodeRepository.findAll();
        assertThat(nextEpisodeList).hasSize(databaseSizeBeforeCreate + 1);
        NextEpisode testNextEpisode = nextEpisodeList.get(nextEpisodeList.size() - 1);
        assertThat(testNextEpisode.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testNextEpisode.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testNextEpisode.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);
        assertThat(testNextEpisode.getEpisodeNumber()).isEqualTo(DEFAULT_EPISODE_NUMBER);
        assertThat(testNextEpisode.getEpisodeSeason()).isEqualTo(DEFAULT_EPISODE_SEASON);
        assertThat(testNextEpisode.getEpisodeDate()).isEqualTo(DEFAULT_EPISODE_DATE);

        // Validate the NextEpisode in Elasticsearch
        verify(mockNextEpisodeSearchRepository, times(1)).save(testNextEpisode);
    }

    @Test
    @Transactional
    public void createNextEpisodeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = nextEpisodeRepository.findAll().size();

        // Create the NextEpisode with an existing ID
        nextEpisode.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restNextEpisodeMockMvc.perform(post("/api/next-episodes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(nextEpisode)))
            .andExpect(status().isBadRequest());

        // Validate the NextEpisode in the database
        List<NextEpisode> nextEpisodeList = nextEpisodeRepository.findAll();
        assertThat(nextEpisodeList).hasSize(databaseSizeBeforeCreate);

        // Validate the NextEpisode in Elasticsearch
        verify(mockNextEpisodeSearchRepository, times(0)).save(nextEpisode);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = nextEpisodeRepository.findAll().size();
        // set the field null
        nextEpisode.setName(null);

        // Create the NextEpisode, which fails.

        restNextEpisodeMockMvc.perform(post("/api/next-episodes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(nextEpisode)))
            .andExpect(status().isBadRequest());

        List<NextEpisode> nextEpisodeList = nextEpisodeRepository.findAll();
        assertThat(nextEpisodeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllNextEpisodes() throws Exception {
        // Initialize the database
        nextEpisodeRepository.saveAndFlush(nextEpisode);

        // Get all the nextEpisodeList
        restNextEpisodeMockMvc.perform(get("/api/next-episodes?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(nextEpisode.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].imageContentType").value(hasItem(DEFAULT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMAGE))))
            .andExpect(jsonPath("$.[*].episodeNumber").value(hasItem(DEFAULT_EPISODE_NUMBER)))
            .andExpect(jsonPath("$.[*].episodeSeason").value(hasItem(DEFAULT_EPISODE_SEASON)))
            .andExpect(jsonPath("$.[*].episodeDate").value(hasItem(DEFAULT_EPISODE_DATE.toString())));
    }
    
    @Test
    @Transactional
    public void getNextEpisode() throws Exception {
        // Initialize the database
        nextEpisodeRepository.saveAndFlush(nextEpisode);

        // Get the nextEpisode
        restNextEpisodeMockMvc.perform(get("/api/next-episodes/{id}", nextEpisode.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(nextEpisode.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.imageContentType").value(DEFAULT_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.image").value(Base64Utils.encodeToString(DEFAULT_IMAGE)))
            .andExpect(jsonPath("$.episodeNumber").value(DEFAULT_EPISODE_NUMBER))
            .andExpect(jsonPath("$.episodeSeason").value(DEFAULT_EPISODE_SEASON))
            .andExpect(jsonPath("$.episodeDate").value(DEFAULT_EPISODE_DATE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingNextEpisode() throws Exception {
        // Get the nextEpisode
        restNextEpisodeMockMvc.perform(get("/api/next-episodes/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateNextEpisode() throws Exception {
        // Initialize the database
        nextEpisodeRepository.saveAndFlush(nextEpisode);

        int databaseSizeBeforeUpdate = nextEpisodeRepository.findAll().size();

        // Update the nextEpisode
        NextEpisode updatedNextEpisode = nextEpisodeRepository.findById(nextEpisode.getId()).get();
        // Disconnect from session so that the updates on updatedNextEpisode are not directly saved in db
        em.detach(updatedNextEpisode);
        updatedNextEpisode
            .name(UPDATED_NAME)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE)
            .episodeNumber(UPDATED_EPISODE_NUMBER)
            .episodeSeason(UPDATED_EPISODE_SEASON)
            .episodeDate(UPDATED_EPISODE_DATE);

        restNextEpisodeMockMvc.perform(put("/api/next-episodes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedNextEpisode)))
            .andExpect(status().isOk());

        // Validate the NextEpisode in the database
        List<NextEpisode> nextEpisodeList = nextEpisodeRepository.findAll();
        assertThat(nextEpisodeList).hasSize(databaseSizeBeforeUpdate);
        NextEpisode testNextEpisode = nextEpisodeList.get(nextEpisodeList.size() - 1);
        assertThat(testNextEpisode.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testNextEpisode.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testNextEpisode.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
        assertThat(testNextEpisode.getEpisodeNumber()).isEqualTo(UPDATED_EPISODE_NUMBER);
        assertThat(testNextEpisode.getEpisodeSeason()).isEqualTo(UPDATED_EPISODE_SEASON);
        assertThat(testNextEpisode.getEpisodeDate()).isEqualTo(UPDATED_EPISODE_DATE);

        // Validate the NextEpisode in Elasticsearch
        verify(mockNextEpisodeSearchRepository, times(1)).save(testNextEpisode);
    }

    @Test
    @Transactional
    public void updateNonExistingNextEpisode() throws Exception {
        int databaseSizeBeforeUpdate = nextEpisodeRepository.findAll().size();

        // Create the NextEpisode

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restNextEpisodeMockMvc.perform(put("/api/next-episodes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(nextEpisode)))
            .andExpect(status().isBadRequest());

        // Validate the NextEpisode in the database
        List<NextEpisode> nextEpisodeList = nextEpisodeRepository.findAll();
        assertThat(nextEpisodeList).hasSize(databaseSizeBeforeUpdate);

        // Validate the NextEpisode in Elasticsearch
        verify(mockNextEpisodeSearchRepository, times(0)).save(nextEpisode);
    }

    @Test
    @Transactional
    public void deleteNextEpisode() throws Exception {
        // Initialize the database
        nextEpisodeRepository.saveAndFlush(nextEpisode);

        int databaseSizeBeforeDelete = nextEpisodeRepository.findAll().size();

        // Get the nextEpisode
        restNextEpisodeMockMvc.perform(delete("/api/next-episodes/{id}", nextEpisode.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<NextEpisode> nextEpisodeList = nextEpisodeRepository.findAll();
        assertThat(nextEpisodeList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the NextEpisode in Elasticsearch
        verify(mockNextEpisodeSearchRepository, times(1)).deleteById(nextEpisode.getId());
    }

    @Test
    @Transactional
    public void searchNextEpisode() throws Exception {
        // Initialize the database
        nextEpisodeRepository.saveAndFlush(nextEpisode);
        when(mockNextEpisodeSearchRepository.search(queryStringQuery("id:" + nextEpisode.getId())))
            .thenReturn(Collections.singletonList(nextEpisode));
        // Search the nextEpisode
        restNextEpisodeMockMvc.perform(get("/api/_search/next-episodes?query=id:" + nextEpisode.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(nextEpisode.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].imageContentType").value(hasItem(DEFAULT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMAGE))))
            .andExpect(jsonPath("$.[*].episodeNumber").value(hasItem(DEFAULT_EPISODE_NUMBER)))
            .andExpect(jsonPath("$.[*].episodeSeason").value(hasItem(DEFAULT_EPISODE_SEASON)))
            .andExpect(jsonPath("$.[*].episodeDate").value(hasItem(DEFAULT_EPISODE_DATE.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(NextEpisode.class);
        NextEpisode nextEpisode1 = new NextEpisode();
        nextEpisode1.setId(1L);
        NextEpisode nextEpisode2 = new NextEpisode();
        nextEpisode2.setId(nextEpisode1.getId());
        assertThat(nextEpisode1).isEqualTo(nextEpisode2);
        nextEpisode2.setId(2L);
        assertThat(nextEpisode1).isNotEqualTo(nextEpisode2);
        nextEpisode1.setId(null);
        assertThat(nextEpisode1).isNotEqualTo(nextEpisode2);
    }
}
