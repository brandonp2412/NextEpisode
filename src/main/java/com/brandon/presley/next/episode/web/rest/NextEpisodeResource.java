package com.brandon.presley.next.episode.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.brandon.presley.next.episode.domain.NextEpisode;
import com.brandon.presley.next.episode.repository.NextEpisodeRepository;
import com.brandon.presley.next.episode.repository.search.NextEpisodeSearchRepository;
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
 * REST controller for managing NextEpisode.
 */
@RestController
@RequestMapping("/api")
public class NextEpisodeResource {

    private final Logger log = LoggerFactory.getLogger(NextEpisodeResource.class);

    private static final String ENTITY_NAME = "nextEpisode";

    private final NextEpisodeRepository nextEpisodeRepository;

    private final NextEpisodeSearchRepository nextEpisodeSearchRepository;

    public NextEpisodeResource(NextEpisodeRepository nextEpisodeRepository, NextEpisodeSearchRepository nextEpisodeSearchRepository) {
        this.nextEpisodeRepository = nextEpisodeRepository;
        this.nextEpisodeSearchRepository = nextEpisodeSearchRepository;
    }

    /**
     * POST  /next-episodes : Create a new nextEpisode.
     *
     * @param nextEpisode the nextEpisode to create
     * @return the ResponseEntity with status 201 (Created) and with body the new nextEpisode, or with status 400 (Bad Request) if the nextEpisode has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/next-episodes")
    @Timed
    public ResponseEntity<NextEpisode> createNextEpisode(@Valid @RequestBody NextEpisode nextEpisode) throws URISyntaxException {
        log.debug("REST request to save NextEpisode : {}", nextEpisode);
        if (nextEpisode.getId() != null) {
            throw new BadRequestAlertException("A new nextEpisode cannot already have an ID", ENTITY_NAME, "idexists");
        }
        NextEpisode result = nextEpisodeRepository.save(nextEpisode);
        nextEpisodeSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/next-episodes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /next-episodes : Updates an existing nextEpisode.
     *
     * @param nextEpisode the nextEpisode to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated nextEpisode,
     * or with status 400 (Bad Request) if the nextEpisode is not valid,
     * or with status 500 (Internal Server Error) if the nextEpisode couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/next-episodes")
    @Timed
    public ResponseEntity<NextEpisode> updateNextEpisode(@Valid @RequestBody NextEpisode nextEpisode) throws URISyntaxException {
        log.debug("REST request to update NextEpisode : {}", nextEpisode);
        if (nextEpisode.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        NextEpisode result = nextEpisodeRepository.save(nextEpisode);
        nextEpisodeSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, nextEpisode.getId().toString()))
            .body(result);
    }

    /**
     * GET  /next-episodes : get all the nextEpisodes.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of nextEpisodes in body
     */
    @GetMapping("/next-episodes")
    @Timed
    public List<NextEpisode> getAllNextEpisodes() {
        log.debug("REST request to get all NextEpisodes");
        return nextEpisodeRepository.findAll();
    }

    /**
     * GET  /next-episodes/:id : get the "id" nextEpisode.
     *
     * @param id the id of the nextEpisode to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the nextEpisode, or with status 404 (Not Found)
     */
    @GetMapping("/next-episodes/{id}")
    @Timed
    public ResponseEntity<NextEpisode> getNextEpisode(@PathVariable Long id) {
        log.debug("REST request to get NextEpisode : {}", id);
        Optional<NextEpisode> nextEpisode = nextEpisodeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(nextEpisode);
    }

    /**
     * DELETE  /next-episodes/:id : delete the "id" nextEpisode.
     *
     * @param id the id of the nextEpisode to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/next-episodes/{id}")
    @Timed
    public ResponseEntity<Void> deleteNextEpisode(@PathVariable Long id) {
        log.debug("REST request to delete NextEpisode : {}", id);

        nextEpisodeRepository.deleteById(id);
        nextEpisodeSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/next-episodes?query=:query : search for the nextEpisode corresponding
     * to the query.
     *
     * @param query the query of the nextEpisode search
     * @return the result of the search
     */
    @GetMapping("/_search/next-episodes")
    @Timed
    public List<NextEpisode> searchNextEpisodes(@RequestParam String query) {
        log.debug("REST request to search NextEpisodes for query {}", query);
        return StreamSupport
            .stream(nextEpisodeSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
