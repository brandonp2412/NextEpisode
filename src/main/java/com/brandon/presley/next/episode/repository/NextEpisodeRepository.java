package com.brandon.presley.next.episode.repository;

import com.brandon.presley.next.episode.domain.NextEpisode;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the NextEpisode entity.
 */
@SuppressWarnings("unused")
@Repository
public interface NextEpisodeRepository extends JpaRepository<NextEpisode, Long> {

    @Query("select next_episode from NextEpisode next_episode where next_episode.user.login = ?#{principal.username}")
    List<NextEpisode> findByUserIsCurrentUser();

}
