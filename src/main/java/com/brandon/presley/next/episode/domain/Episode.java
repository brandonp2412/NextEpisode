package com.brandon.presley.next.episode.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A Episode.
 */
@Entity
@Table(name = "episode")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "episode")
public class Episode implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "jhi_number", nullable = false)
    private Integer number;

    @Column(name = "season")
    private Integer season;

    @NotNull
    @Column(name = "release_date", nullable = false)
    private LocalDate releaseDate;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNumber() {
        return number;
    }

    public Episode number(Integer number) {
        this.number = number;
        return this;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    public Integer getSeason() {
        return season;
    }

    public Episode season(Integer season) {
        this.season = season;
        return this;
    }

    public void setSeason(Integer season) {
        this.season = season;
    }

    public LocalDate getReleaseDate() {
        return releaseDate;
    }

    public Episode releaseDate(LocalDate releaseDate) {
        this.releaseDate = releaseDate;
        return this;
    }

    public void setReleaseDate(LocalDate releaseDate) {
        this.releaseDate = releaseDate;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Episode episode = (Episode) o;
        if (episode.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), episode.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Episode{" +
            "id=" + getId() +
            ", number=" + getNumber() +
            ", season=" + getSeason() +
            ", releaseDate='" + getReleaseDate() + "'" +
            "}";
    }
}
