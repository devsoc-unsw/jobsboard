<template notLoggedIn>
    <div v-if="show" class="modal fixed w-full h-full top-0 left-0 flex items-center justify-center z-40">
        <div class="modal-overlay absolute w-full h-full bg-gray-900 opacity-75"></div>
        <div class="modal-container bg-neutral-100 w-11/12 md:max-w-md mx-auto rounded-md shadow-lg z-50 overflow-y-auto">
            <div class="modal-content py-4 px-6 text-center">
                    <div class="pt-2 ease-linear grid justify-items-end cursor-pointer hover:text-jb-textlink-hovered" @click="closeModal()">
                        <font-awesome-icon icon="x" />
                    </div>
                    <h1 class="font-semibold text-xl mb-0 text-jb-headings pt-3 text-center modal-title">Student Login</h1>
                    <p class="text-base text-jb-subheadings pt-4 text-center">
                        Please enter your zID in the format zXXXXXXX and your zPass.
                    </p>
                    <div v-if="error">
                        <ErrorBox>
                        {{ errorMsg }}
                        </ErrorBox>
                    </div>
                    <div class="py-4 text-left">
                        <label for="username" class="font-bold text-base text-jb-subheadings mt-2">zID</label>
                        <input type="text" placeholder="zXXXXXXX" v-model="username" class="border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg focus:outline-jb-textlink sm:w-full peer" @keyup.enter="performLogin()">
                    </div>
                    <div class="py-4 text-left">
                        <label for="password" class="font-bold text-left text-base text-jb-subheadings mt-2 ">Password</label>
                        <input type="password" placeholder="zPass" v-model="password" class="border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg focus:outline-jb-textlink sm:w-full peer" @keyup.enter="performLogin()">
                    </div>
                    <p class="text-base text-jb-subheadings text-center py-4">
                        Not a student? <span 
                        class="text-jb-textlink font-bold transition-colors duration-200 ease-linear 
                                    cursor-pointer hover:text-jb-textlink-hovered"
                        @click="toCompanyLoginPage"
                        >
                        Company Login
                        </span>
                    </p>
                    <div class="py-4">
                        <button type="submit" class="bg-jb-textlink rounded-md w-40 h-11 p-2 text-white font-bold text-base border-0 shadow-btn duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-btn-hovered">
                        <span class="p-2 text-white" @click="performLogin()">Log In</span>
                    </button>
                    </div>
            </div>
        </div>
    </div>
</template>
<script>
    // components
    import ErrorBox from "@/components/ErrorBox.vue";
    
    // config
    import config from "@/config/config";
    
    export default {
        name: "StudentLoginModal",
        components: {
            ErrorBox
        },
        props: {
            show: Boolean
        },
        data() {
            return{
                username: "",
                password: "",
                error: false,
                errorMsg: "",
            }
        },
        async mounted() {
            this.$store.dispatch("clearApiToken");
        },
        methods:{
            async closeModal() {
                this.$emit("close")
            },
            async performLogin() {
                const response = await fetch(`${config.apiRoot}/authenticate/student`, {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                    },
                    // mode: "no-cors",
                    body: JSON.stringify({
                    zID: this.zID,
                    password: this.password,
                    }),
                });
                if (response.ok) {
                    const msg = await response.json();
                    this.error = false;
                    this.$store.dispatch("setApiToken", msg.token);
                    this.$router.push("/jobs");
                } else {
                    this.error = true;
                    window.scrollTo(0, 10);
                    this.errorMsg = "Invalid credentials. Please try again.";
                }
            },
        }
    }
</script>