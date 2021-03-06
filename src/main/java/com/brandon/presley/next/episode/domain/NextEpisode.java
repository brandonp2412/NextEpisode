package com.brandon.presley.next.episode.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A NextEpisode.
 */
@Entity
@Table(name = "next_episode")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "nextepisode")
public class NextEpisode implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Lob
    @Column(name = "image")
    private byte[] image;

    @Column(name = "image_content_type")
    private String imageContentType;

    @Column(name = "episode_number")
    private Integer episodeNumber;

    @Column(name = "episode_season")
    private Integer episodeSeason;

    @Column(name = "episode_date")
    private LocalDate episodeDate;

    @ManyToOne
    @JsonIgnoreProperties("")
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public NextEpisode name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public byte[] getImage() {
        return image;
    }

    public NextEpisode image(byte[] image) {
        this.image = image;
        return this;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageContentType() {
        return imageContentType;
    }

    public NextEpisode imageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
        return this;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public Integer getEpisodeNumber() {
        return episodeNumber;
    }

    public NextEpisode episodeNumber(Integer episodeNumber) {
        this.episodeNumber = episodeNumber;
        return this;
    }

    public void setEpisodeNumber(Integer episodeNumber) {
        this.episodeNumber = episodeNumber;
    }

    public Integer getEpisodeSeason() {
        return episodeSeason;
    }

    public NextEpisode episodeSeason(Integer episodeSeason) {
        this.episodeSeason = episodeSeason;
        return this;
    }

    public void setEpisodeSeason(Integer episodeSeason) {
        this.episodeSeason = episodeSeason;
    }

    public LocalDate getEpisodeDate() {
        return episodeDate;
    }

    public NextEpisode episodeDate(LocalDate episodeDate) {
        this.episodeDate = episodeDate;
        return this;
    }

    public void setEpisodeDate(LocalDate episodeDate) {
        this.episodeDate = episodeDate;
    }

    public User getUser() {
        return user;
    }

    public NextEpisode user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
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
        NextEpisode nextEpisode = (NextEpisode) o;
        if (nextEpisode.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), nextEpisode.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "NextEpisode{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", image='" + getImage() + "'" +
            ", imageContentType='" + getImageContentType() + "'" +
            ", episodeNumber=" + getEpisodeNumber() +
            ", episodeSeason=" + getEpisodeSeason() +
            ", episodeDate='" + getEpisodeDate() + "'" +
            "}";
    }
}
