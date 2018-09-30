package com.brandon.presley.next.episode.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of NextEpisodeSearchRepository to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class NextEpisodeSearchRepositoryMockConfiguration {

    @MockBean
    private NextEpisodeSearchRepository mockNextEpisodeSearchRepository;

}
