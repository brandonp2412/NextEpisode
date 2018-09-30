package com.brandon.presley.next.episode.repository.search;

import com.brandon.presley.next.episode.domain.NextEpisode;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the NextEpisode entity.
 */
public interface NextEpisodeSearchRepository extends ElasticsearchRepository<NextEpisode, Long> {
}
