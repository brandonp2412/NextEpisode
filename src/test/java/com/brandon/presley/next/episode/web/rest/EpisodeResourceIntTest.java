package com.brandon.presley.next.episode.web.rest;

import com.brandon.presley.next.episode.NextEpisodeApp;

import com.brandon.presley.next.episode.domain.Episode;
import com.brandon.presley.next.episode.repository.EpisodeRepository;
import com.brandon.presley.next.episode.repository.search.EpisodeSearchRepository;
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
 * Test class for the EpisodeResource REST controller.
 *
 * @see EpisodeResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = NextEpisodeApp.class)
public class EpisodeResourceIntTest {

    private static final Integer DEFAULT_NUMBER = 1;
    private static final Integer UPDATED_NUMBER = 2;

    private static final Integer DEFAULT_SEASON = 1;
    private static final Integer UPDATED_SEASON = 2;

    private static final LocalDate DEFAULT_RELEASE_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_RELEASE_DATE = LocalDate.now(ZoneId.systemDefault());

    @Autowired
    private EpisodeRepository episodeRepository;

    /**
     * This repository is mocked in the com.brandon.presley.next.episode.repository.search test package.
     *
     * @see com.brandon.presley.next.episode.repository.search.EpisodeSearchRepositoryMockConfiguration
     */
    @Autowired
    private EpisodeSearchRepository mockEpisodeSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restEpisodeMockMvc;

    private Episode episode;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final EpisodeResource episodeResource = new EpisodeResource(episodeRepository, mockEpisodeSearchRepository);
        this.restEpisodeMockMvc = MockMvcBuilders.standaloneSetup(episodeResource)
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
    public static Episode createEntity(EntityManager em) {
        Episode episode = new Episode()
            .number(DEFAULT_NUMBER)
            .season(DEFAULT_SEASON)
            .releaseDate(DEFAULT_RELEASE_DATE);
        return episode;
    }

    @Before
    public void initTest() {
        episode = createEntity(em);
    }

    @Test
    @Transactional
    public void createEpisode() throws Exception {
        int databaseSizeBeforeCreate = episodeRepository.findAll().size();

        // Create the Episode
        restEpisodeMockMvc.perform(post("/api/episodes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(episode)))
            .andExpect(status().isCreated());

        // Validate the Episode in the database
        List<Episode> episodeList = episodeRepository.findAll();
        assertThat(episodeList).hasSize(databaseSizeBeforeCreate + 1);
        Episode testEpisode = episodeList.get(episodeList.size() - 1);
        assertThat(testEpisode.getNumber()).isEqualTo(DEFAULT_NUMBER);
        assertThat(testEpisode.getSeason()).isEqualTo(DEFAULT_SEASON);
        assertThat(testEpisode.getReleaseDate()).isEqualTo(DEFAULT_RELEASE_DATE);

        // Validate the Episode in Elasticsearch
        verify(mockEpisodeSearchRepository, times(1)).save(testEpisode);
    }

    @Test
    @Transactional
    public void createEpisodeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = episodeRepository.findAll().size();

        // Create the Episode with an existing ID
        episode.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restEpisodeMockMvc.perform(post("/api/episodes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(episode)))
            .andExpect(status().isBadRequest());

        // Validate the Episode in the database
        List<Episode> episodeList = episodeRepository.findAll();
        assertThat(episodeList).hasSize(databaseSizeBeforeCreate);

        // Validate the Episode in Elasticsearch
        verify(mockEpisodeSearchRepository, times(0)).save(episode);
    }

    @Test
    @Transactional
    public void checkNumberIsRequired() throws Exception {
        int databaseSizeBeforeTest = episodeRepository.findAll().size();
        // set the field null
        episode.setNumber(null);

        // Create the Episode, which fails.

        restEpisodeMockMvc.perform(post("/api/episodes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(episode)))
            .andExpect(status().isBadRequest());

        List<Episode> episodeList = episodeRepository.findAll();
        assertThat(episodeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkReleaseDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = episodeRepository.findAll().size();
        // set the field null
        episode.setReleaseDate(null);

        // Create the Episode, which fails.

        restEpisodeMockMvc.perform(post("/api/episodes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(episode)))
            .andExpect(status().isBadRequest());

        List<Episode> episodeList = episodeRepository.findAll();
        assertThat(episodeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllEpisodes() throws Exception {
        // Initialize the database
        episodeRepository.saveAndFlush(episode);

        // Get all the episodeList
        restEpisodeMockMvc.perform(get("/api/episodes?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(episode.getId().intValue())))
            .andExpect(jsonPath("$.[*].number").value(hasItem(DEFAULT_NUMBER)))
            .andExpect(jsonPath("$.[*].season").value(hasItem(DEFAULT_SEASON)))
            .andExpect(jsonPath("$.[*].releaseDate").value(hasItem(DEFAULT_RELEASE_DATE.toString())));
    }
    
    @Test
    @Transactional
    public void getEpisode() throws Exception {
        // Initialize the database
        episodeRepository.saveAndFlush(episode);

        // Get the episode
        restEpisodeMockMvc.perform(get("/api/episodes/{id}", episode.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(episode.getId().intValue()))
            .andExpect(jsonPath("$.number").value(DEFAULT_NUMBER))
            .andExpect(jsonPath("$.season").value(DEFAULT_SEASON))
            .andExpect(jsonPath("$.releaseDate").value(DEFAULT_RELEASE_DATE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingEpisode() throws Exception {
        // Get the episode
        restEpisodeMockMvc.perform(get("/api/episodes/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateEpisode() throws Exception {
        // Initialize the database
        episodeRepository.saveAndFlush(episode);

        int databaseSizeBeforeUpdate = episodeRepository.findAll().size();

        // Update the episode
        Episode updatedEpisode = episodeRepository.findById(episode.getId()).get();
        // Disconnect from session so that the updates on updatedEpisode are not directly saved in db
        em.detach(updatedEpisode);
        updatedEpisode
            .number(UPDATED_NUMBER)
            .season(UPDATED_SEASON)
            .releaseDate(UPDATED_RELEASE_DATE);

        restEpisodeMockMvc.perform(put("/api/episodes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedEpisode)))
            .andExpect(status().isOk());

        // Validate the Episode in the database
        List<Episode> episodeList = episodeRepository.findAll();
        assertThat(episodeList).hasSize(databaseSizeBeforeUpdate);
        Episode testEpisode = episodeList.get(episodeList.size() - 1);
        assertThat(testEpisode.getNumber()).isEqualTo(UPDATED_NUMBER);
        assertThat(testEpisode.getSeason()).isEqualTo(UPDATED_SEASON);
        assertThat(testEpisode.getReleaseDate()).isEqualTo(UPDATED_RELEASE_DATE);

        // Validate the Episode in Elasticsearch
        verify(mockEpisodeSearchRepository, times(1)).save(testEpisode);
    }

    @Test
    @Transactional
    public void updateNonExistingEpisode() throws Exception {
        int databaseSizeBeforeUpdate = episodeRepository.findAll().size();

        // Create the Episode

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEpisodeMockMvc.perform(put("/api/episodes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(episode)))
            .andExpect(status().isBadRequest());

        // Validate the Episode in the database
        List<Episode> episodeList = episodeRepository.findAll();
        assertThat(episodeList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Episode in Elasticsearch
        verify(mockEpisodeSearchRepository, times(0)).save(episode);
    }

    @Test
    @Transactional
    public void deleteEpisode() throws Exception {
        // Initialize the database
        episodeRepository.saveAndFlush(episode);

        int databaseSizeBeforeDelete = episodeRepository.findAll().size();

        // Get the episode
        restEpisodeMockMvc.perform(delete("/api/episodes/{id}", episode.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Episode> episodeList = episodeRepository.findAll();
        assertThat(episodeList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Episode in Elasticsearch
        verify(mockEpisodeSearchRepository, times(1)).deleteById(episode.getId());
    }

    @Test
    @Transactional
    public void searchEpisode() throws Exception {
        // Initialize the database
        episodeRepository.saveAndFlush(episode);
        when(mockEpisodeSearchRepository.search(queryStringQuery("id:" + episode.getId())))
            .thenReturn(Collections.singletonList(episode));
        // Search the episode
        restEpisodeMockMvc.perform(get("/api/_search/episodes?query=id:" + episode.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(episode.getId().intValue())))
            .andExpect(jsonPath("$.[*].number").value(hasItem(DEFAULT_NUMBER)))
            .andExpect(jsonPath("$.[*].season").value(hasItem(DEFAULT_SEASON)))
            .andExpect(jsonPath("$.[*].releaseDate").value(hasItem(DEFAULT_RELEASE_DATE.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Episode.class);
        Episode episode1 = new Episode();
        episode1.setId(1L);
        Episode episode2 = new Episode();
        episode2.setId(episode1.getId());
        assertThat(episode1).isEqualTo(episode2);
        episode2.setId(2L);
        assertThat(episode1).isNotEqualTo(episode2);
        episode1.setId(null);
        assertThat(episode1).isNotEqualTo(episode2);
    }
}
