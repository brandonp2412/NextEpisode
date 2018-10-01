package com.brandon.presley.next.episode.repository;

import com.brandon.presley.next.episode.domain.Program;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Program entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProgramRepository extends JpaRepository<Program, Long> {
    @Query("select program from Program program where program.user.login = ?#{principal.username}")
    List<Program> findByUserIsCurrentUser();
}
