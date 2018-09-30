package com.brandon.presley.next.episode.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.brandon.presley.next.episode.domain.Episode;
import com.brandon.presley.next.episode.repository.EpisodeRepository;
import com.brandon.presley.next.episode.repository.search.EpisodeSearchRepository;
import com.brandon.presley.next.episode.web.rest.errors.BadRequestAlertException;
import com.brandon.presley.next.episode.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Episode.
 */
@RestController
@RequestMapping("/api")
public class EpisodeResource {

    private final Logger log = LoggerFactory.getLogger(EpisodeResource.class);

    private static final String ENTITY_NAME = "episode";

    private final EpisodeRepository episodeRepository;

    private final EpisodeSearchRepository episodeSearchRepository;

    public EpisodeResource(EpisodeRepository episodeRepository, EpisodeSearchRepository episodeSearchRepository) {
        this.episodeRepository = episodeRepository;
        this.episodeSearchRepository = episodeSearchRepository;
    }

    /**
     * POST  /episodes : Create a new episode.
     *
     * @param episode the episode to create
     * @return the ResponseEntity with status 201 (Created) and with body the new episode, or with status 400 (Bad Request) if the episode has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/episodes")
    @Timed
    public ResponseEntity<Episode> createEpisode(@Valid @RequestBody Episode episode) throws URISyntaxException {
        log.debug("REST request to save Episode : {}", episode);
        if (episode.getId() != null) {
            throw new BadRequestAlertException("A new episode cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Episode result = episodeRepository.save(episode);
        episodeSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/episodes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /episodes : Updates an existing episode.
     *
     * @param episode the episode to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated episode,
     * or with status 400 (Bad Request) if the episode is not valid,
     * or with status 500 (Internal Server Error) if the episode couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/episodes")
    @Timed
    public ResponseEntity<Episode> updateEpisode(@Valid @RequestBody Episode episode) throws URISyntaxException {
        log.debug("REST request to update Episode : {}", episode);
        if (episode.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Episode result = episodeRepository.save(episode);
        episodeSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, episode.getId().toString()))
            .body(result);
    }

    /**
     * GET  /episodes : get all the episodes.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of episodes in body
     */
    @GetMapping("/episodes")
    @Timed
    public List<Episode> getAllEpisodes() {
        log.debug("REST request to get all Episodes");
        return episodeRepository.findAll();
    }

    /**
     * GET  /episodes/:id : get the "id" episode.
     *
     * @param id the id of the episode to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the episode, or with status 404 (Not Found)
     */
    @GetMapping("/episodes/{id}")
    @Timed
    public ResponseEntity<Episode> getEpisode(@PathVariable Long id) {
        log.debug("REST request to get Episode : {}", id);
        Optional<Episode> episode = episodeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(episode);
    }

    /**
     * DELETE  /episodes/:id : delete the "id" episode.
     *
     * @param id the id of the episode to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/episodes/{id}")
    @Timed
    public ResponseEntity<Void> deleteEpisode(@PathVariable Long id) {
        log.debug("REST request to delete Episode : {}", id);

        episodeRepository.deleteById(id);
        episodeSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/episodes?query=:query : search for the episode corresponding
     * to the query.
     *
     * @param query the query of the episode search
     * @return the result of the search
     */
    @GetMapping("/_search/episodes")
    @Timed
    public List<Episode> searchEpisodes(@RequestParam String query) {
        log.debug("REST request to search Episodes for query {}", query);
        return StreamSupport
            .stream(episodeSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
