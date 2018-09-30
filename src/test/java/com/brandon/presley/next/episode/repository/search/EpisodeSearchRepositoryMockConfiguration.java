package com.brandon.presley.next.episode.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of EpisodeSearchRepository to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class EpisodeSearchRepositoryMockConfiguration {

    @MockBean
    private EpisodeSearchRepository mockEpisodeSearchRepository;

}
