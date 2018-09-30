package com.brandon.presley.next.episode.repository;

import com.brandon.presley.next.episode.domain.NextEpisode;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the NextEpisode entity.
 */
@SuppressWarnings("unused")
@Repository
public interface NextEpisodeRepository extends JpaRepository<NextEpisode, Long> {

}
