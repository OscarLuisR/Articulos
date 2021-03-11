<template>
    <div>
        <v-app>
            <v-dialog v-model="dialog" persistent max-width="600px" min-width="360px">
                <div>
                    <v-tabs v-model="tab" show-arrows background-color="deep-purple accent-4" icons-and-text dark grow>
                        <v-tabs-slider color="purple darken-4"></v-tabs-slider>

                        <v-tab v-for="(i, index) in tabs" :key="index">
                            <v-icon large>{{ i.icon }}</v-icon>
                            <div class="caption py-1">{{ i.name }}</div>
                        </v-tab>
                        
                        <v-tab-item>
                            <v-card class="px-4">
                                <v-card-text>
                                    <v-form ref="loginForm" v-model="valid" lazy-validation>
                                        <v-row>
                                            <v-col>
                                                <v-alert v-if="error" outlined text dense dismissible elevation="7" icon="mdi-account" type="error">{{ error_msg }}</v-alert>
                                            </v-col>

                                            <v-col cols="12">
                                                <v-text-field v-model="loginEmail" :rules="[rules.required, rules.email]" label="E-mail"></v-text-field>
                                            </v-col>

                                            <v-col cols="12">
                                                <v-text-field v-model="loginPassword" :rules="[rules.required, rules.min, rules.max]" :append-icon="show1 ? 'mdi-eye':'mdi-eye-off'" :type="show1 ? 'text' : 'password'" label="Password" counter @click:append="show1 = !show1"></v-text-field>
                                            </v-col>
                                            
                                            <v-col class="d-flex" cols="12" sm="6" xsm="12"></v-col>
                                            
                                            <v-spacer></v-spacer>

                                            <v-col class="d-flex" cols="12" sm="3" xsm="12" align-end>
                                                <v-btn x-large block :disabled="!valid" color="success" @click="validate"> Login </v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-form>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                    </v-tabs>
                </div>
            </v-dialog>
        </v-app>
    </div>
</template>

<script>
    import authService from '../services/api/authService';

    export default {
        name: 'Login',
        data() {
            return {
                error: false,
                error_msg: '',
                dialog: true,
                tab: 0,
                tabs: [
                    {name:"Login", icon:"mdi-account"}
                ],
                valid: false,
                show1: false,
                loginPassword: 'admin',
                loginEmail: 'admin@admin.com',
                rules: {
                    required: value => !!value || "Required.",
                    min: v => (v && v.length >= 5) || "Password must have at least 5 characters.",
                    max: v => (v && v.length <= 10) || "Password must be less than 10 characters.",
                    email: v => /.+@.+\..+/.test(v) || "E-mail must be valid"
                }
            }
        },

        methods: {
            async validate() {
                if (this.$refs.loginForm.validate()) {
                    try {
                        let login = {
                            email: this.loginEmail,
                            password: this.loginPassword
                        }    

                        const res = await authService.post(login);

                        if (res.data.error) {
                            this.error = true;
                            this.error_msg = res.data.message;
                        }else {
                            this.error = false;
                            this.error_msg = '';

                            localStorage.token = res.data.results[0].token;

                            this.$router.push('/listado');
                        }

                    } catch (err) {
                        console.log(err);
                    };
                }
            }
        },

        mounted() {
            this.valid = false;
        },
        
    }
</script>

<style scoped>
    
</style>