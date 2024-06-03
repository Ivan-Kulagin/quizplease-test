<script setup lang="ts">
import { computed, Ref } from 'vue'
import { ref, onMounted, watch } from 'vue'
import CommentTree from './components/Comments/CommentTree.vue'
import type { Comment, User } from './types'
import { fetchComments } from './mock/CommentService.ts'
import { getObjects as deepSearch } from './utils/deepSearch.ts'
import AddComment from './components/Comments/AddComment.vue'
import { deepSort } from './utils/deepSort.ts'
import CommentView from './components/Comments/CommentView.vue'
onMounted(() => {
    fetchComments().then((commentsData) => {
        comments.value = commentsData
    })
})
const comments: Ref<Comment[]> = ref([])
const currentUser: Ref<User> = ref({
    profileId: 1,
    name: 'QuizPlease'
})

const commentText = ref('')
const onCreate = ({ text }) => {
    if (!text) return
    comments.value.unshift({
        text: text,
        replies: [],
        likes: [],
        dislikes: [],
        deleted: false,
        datetime: new Date().toLocaleString('ru-RU'),
        author: currentUser.value,
        id: window.crypto.getRandomValues(new Uint32Array(1))[0]
    })
}
const onUpvote = ({ id }) => {
    const node = deepSearch(comments.value, 'id', id)[0]
    const isAlreadyLiked = node?.likes?.includes(currentUser.value.profileId)
    const isAlreadyDisliked = node?.dislikes?.includes(currentUser.value.profileId)
    if (isAlreadyLiked) {
        node.likes = node.likes.filter((id) => id !== currentUser.value.profileId)
    } else if (isAlreadyDisliked) {
        node.dislikes = node.dislikes.filter((id) => id !== currentUser.value.profileId)
        node.likes.push(currentUser.value.profileId)
    } else {
        node.likes.push(currentUser.value.profileId)
    }
}
const onDownvote = ({ id }) => {
    const node = deepSearch(comments.value, 'id', id)[0]
    const isAlreadyLiked = node?.likes?.includes(currentUser.value.profileId)
    const isAlreadyDisliked = node?.dislikes?.includes(currentUser.value.profileId)
    if (isAlreadyLiked) {
        node.likes = node.likes.filter((id) => id !== currentUser.value.profileId)
        node.dislikes.push(currentUser.value.profileId)
    } else if (isAlreadyDisliked) {
        node.dislikes = node.dislikes.filter((id) => id !== currentUser.value.profileId)
    } else {
        node.dislikes.push(currentUser.value.profileId)
    }
}
const onReply = ({ text, parentId }) => {
    if (!text) return
    const parentNode = deepSearch(comments.value, 'id', parentId)[0]
    if (parentNode) {
        parentNode.replies.unshift({
            text: text,
            replies: [],
            likes: [],
            dislikes: [],
            deleted: false,
            datetime: new Date().toLocaleString('ru-RU'),
            author: currentUser,
            id: window.crypto.getRandomValues(new Uint32Array(1))[0]
        })
    }
}
const onDeleteComment = ({ id }) => {
    const node = deepSearch(comments.value, 'id', id)[0]
    if (node) {
        node.deleted = true
    }
}
const onEditComment = ({ text, id }) => {
    const node = deepSearch(comments.value, 'id', id)[0]
    if (node) {
        node.text = text
    }
}

const searchMode: boolean = ref(false)
const searchQuery: string = ref('')
const foundComments: Comment[] = computed(() => {
    return deepSearch(comments.value, 'text', searchQuery.value, { strict: false })
})

const sortOrder: 'asc' | 'desc' = ref('asc')
watch([sortOrder], () => {
  comments.value = deepSort(comments.value, sortOrder.value)
})
</script>

<template>
  <div class="user-selection">
    <Dropdown
      v-model="currentUser"
      option-label="name"
      :options="[{ profileId: 1, name: 'QuizPlease' }, { profileId: 2, name: 'Vasiliy' }]"
    />
  </div>
  <div class="sort-selection">
    <Button :outlined="!searchMode" label="Поиск комментариев" @click="searchMode = !searchMode" />
    <Button
      v-if="!searchMode"
      text
      label="Лайки"
      icon-pos="right"
      :icon="sortOrder === 'asc' ? 'pi pi-sort-amount-up' : 'pi pi-sort-amount-down'"
      @click="sortOrder = (sortOrder === 'asc') ? 'desc' : 'asc'"
    />
  </div>
  <div v-if="searchMode">
    <InputText v-model="searchQuery" placeholder="Введите текст комментария" />
    <template v-for="comment in foundComments">
      <CommentView :text="comment.text" :author="comment.author" :datetime="comment.datetime" />
    </template>
  </div>
  <div class="comments-wrapper" v-else>
    <AddComment v-model="commentText" @save="onCreate" :parent-id="null" />
    <CommentTree
      :current-user="currentUser"
      :comments="comments"
      @comment:edit="onEditComment"
      @comment:delete="onDeleteComment"
      @reply:create="onReply"
      @upvote="onUpvote"
      @downvote="onDownvote"
    />
  </div>
</template>

<style>
a {
    color: black;
}
body {
    background: #FEFEFE;
    padding: 2rem;
}
.sort-selection {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
}
.user-selection {
    margin-bottom: 20px;
}
.comments-wrapper {
    max-width: 800px;
    overflow: hidden;
}
</style>
