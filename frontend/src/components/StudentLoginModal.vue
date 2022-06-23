<template>
    <div v-if="show" class="modal fixed w-full h-full top-0 left-0 flex items-center justify-center z-40">
        <div @click.self="closeModal()" class="modal-overlay absolute w-full h-full bg-gray-900 opacity-75"></div>
        <div class="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded-md shadow-lg z-50 overflow-y-auto">
            <div class="modal-content py-4 px-6 text-center">
                    <h1 class="font-semibold text-xl mb-0 text-jb-headings pt-3 text-center modal-title">Student Login</h1>
                    <p class="text-base text-jb-subheadings my-6 mx-8 sm:mx-[18%] text-center">
                        Enter your username and password. If there are any problems, please get in touch with a project lead.
                    </p>
                    <div>
                        <label for="username" class="font-bold text-base text-jb-subheadings mt-2">zID</label>
                        <input type="text" v-model="username" class="border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg focus:outline-jb-textlink sm:w-full peer" required>
                    </div>
                    <div class="mt-5">
                        <label for="password" class="font-bold text-left text-base text-jb-subheadings mt-2 ">Password</label>
                        <input type="text" v-model="password" class="border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg focus:outline-jb-textlink sm:w-full peer" required>
                    </div>
                    <p class="text-base text-jb-subheadings text-center">
                        Not a student? <span 
                        class="text-jb-textlink font-bold transition-colors duration-200 ease-linear 
                                    cursor-pointer hover:text-jb-textlink-hovered"
                        >
                        Company Login
                        </span>
                    </p>
                    <div class="mt-6">
                        <button type="submit" class="bg-jb-textlink rounded-md w-40 h-11 m-2 text-white font-bold text-base border-0 shadow-btn duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-btn-hovered">
                        <span class="m-2  text-white" @click="closeModal()">Log In</span>
                    </button>
                    </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "StudentLoginModal",
        props: {
            show: Boolean
        },
        data() {
            return{
                 username: "",
                 password: "",
            }
        },
        methods:{
            closeModal() {
                this.$emit("close")
            }

        }
    }
</script>