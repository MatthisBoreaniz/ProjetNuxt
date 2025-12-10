<script setup lang="ts">
import type { SanityDocument } from '@sanity/client'

const BOOK_QUERY = groq`*[_type == "book" && slug.current == $slug][0]
{slug, title, cover, image, body, publishedAt, author -> {nom}, categories[]->{...,nom}}`
const { params } = useRoute()

const { data: book } = await useLazySanityQuery<SanityDocument>(BOOK_QUERY, params)

const { urlFor } = useSanityImage()
</script>

<template>
  <main
    v-if="book"
    class="livre"
  >
    <a href="/books/">&larr; Back to books</a>
    <img
      v-if="book.image"
      :src="urlFor(book.image)?.width(550).height(310).url()"
      :alt="book?.title"
      class="aspect-video rounded-xl"
      width="550"
      height="310"
    >
    <h1 v-if="book.title" class="text-4xl font-bold mb-8">{{ book.title }}</h1>
    <p v-for="categorie in book.categories" :key="categorie._id">by {{ categorie.nom }}</p>
    <p>{{ book.body[0].children[0].text }}</p>
    <SanityContent v-if="book.body" :blocks="book.body" />
    <div class="prose">
      <p v-if="book.publishedAt">
        Published: {{ new Date(book.publishedAt).toLocaleDateString() }}
      </p>
    </div>
    <p>by {{ book.author.nom }}</p>
  </main>
</template>
<style>
.livre {
    max-width: 700px;
    margin: auto;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}
</style>