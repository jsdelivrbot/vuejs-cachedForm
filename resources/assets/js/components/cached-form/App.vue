<template>
    <div class="card">
        <div class="col-12">
            <div class="row">
                <div class="card-header col-12">
                    <h5> Cached Form </h5>
                </div>
            </div>
            <div class="card-body">
                <form action="task-question" method="POST">
                    <stepOne
                        title="Form Title"
                        :auth="{
                          client_id: 'your_secret_id',
                          client_secret: 'your_secret_key',
                          email: 'your_awesome_email@mail.com',
                          password: 'your_password'
                        }"
                        subTitle="Form Sub Title"></stepOne>
                </form>
            </div>
        </div>
    </div>
</template>


<script>
    export default {
        name: "App",
    }
</script>

<style scoped>

</style>
