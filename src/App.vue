<script setup lang="ts">
import type { Ref } from 'vue'
import { ref, onMounted } from 'vue'
import CommentTree from './components/Comments/CommentTree.vue'
import type { Comment } from './types'
import { fetchComments } from './mock/CommentService.ts'
import { getObjects as deepSearch } from './utils/deepSearch.ts'
import AddComment from './components/Comments/AddComment.vue'
onMounted(() => {
    fetchComments().then((commentsData) => {
        comments.value = commentsData
    })
})
const comments: Ref<Comment[]> = ref([])
const currentUser = {
    profileId: 1,
    name: 'QuizPlease'
}

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
        author: currentUser,
        id: window.crypto.getRandomValues(new Uint32Array(1))[0]
    })
}
const onUpvote = ({ id }) => {
    const node = deepSearch(comments.value, 'id', id)[0]
    const isAlreadyLiked = node?.likes?.includes(currentUser.profileId)
    const isAlreadyDisliked = node?.dislikes?.includes(currentUser.profileId)
    if (isAlreadyLiked) {
        node.likes = node.likes.filter((id) => id !== currentUser.profileId)
    } else if (isAlreadyDisliked) {
        node.dislikes = node.dislikes.filter((id) => id !== currentUser.profileId)
        node.likes.push(currentUser.profileId)
    } else {
        node.likes.push(currentUser.profileId)
    }
}
const onDownvote = ({ id }) => {
    const node = deepSearch(comments.value, 'id', id)[0]
    const isAlreadyLiked = node?.likes?.includes(currentUser.profileId)
    const isAlreadyDisliked = node?.dislikes?.includes(currentUser.profileId)
    if (isAlreadyLiked) {
        node.likes = node.likes.filter((id) => id !== currentUser.profileId)
        node.dislikes.push(currentUser.profileId)
    } else if (isAlreadyDisliked) {
        node.dislikes = node.dislikes.filter((id) => id !== currentUser.profileId)
    } else {
        node.dislikes.push(currentUser.profileId)
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
    console.log('onEdit', text, id)
    const node = deepSearch(comments.value, 'id', id)[0]
    if (node) {
        node.text = text
    }
}
</script>

<template>
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
</template>

<style>
body {
    background: #FEFEFE;
}
</style>
