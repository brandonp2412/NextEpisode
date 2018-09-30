package com.brandon.presley.next.episode.repository.search;

import com.brandon.presley.next.episode.domain.Episode;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Episode entity.
 */
public interface EpisodeSearchRepository extends ElasticsearchRepository<Episode, Long> {
}
