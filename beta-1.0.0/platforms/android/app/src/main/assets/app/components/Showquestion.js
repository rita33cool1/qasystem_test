const httpModule = require("http");
module.exports = {
    data() {
        return {
            apiUrl: "http://140.114.79.86:8000/api/question/?qid=" + this.$cur_qid.val,
            deleteUrl: "http://140.114.79.86:8000/api/user/question/delete/",
            title: "Tmp title",
            content: "None",
            askername: "None",
            expertises: [],
            answers: [],
        }
    },
    methods: {
        load: function() {
            console.log("Show the question");
            httpModule.request({
                url: this.apiUrl,
                method: "GET",
                headers: { "Content-Type": "application/json" }
            }).then((response) => {
                const result = response.content.toJSON();
                console.log(result); //result[0]:question result[1]:answers
                
                this.title = result[0].title;
                this.content = result[0].content;
                this.askername = result[0].username;

                for (var i = 0; i < result[0].expertises.length; i++) {
                    this.expertises.push(result[0].expertises[i]);
                }
                    
                for (var i = 0; i < result[0].answer_number; i++) {
                    this.answers.push(result[1][i].content);
                }
                console.log(this.answers);
            }, (e) => {
                console.log(e);
            });
        },
        deleteQuestion: function() {
            console.log("delete the question");
            httpModule.request({
                url: this.deleteUrl,
                method: "POST",
                headers: { "Content-Type": "application/json" },
                content: JSON.stringify({
                    key: this.$user_id.val,
                    question_id: this.$cur_qid.val
                })
            }).then((response) => {
                const result = response.content.toJSON();
                if (result.msg == "Success") {
                    alert(result.msg);
                    this.$router.go(-1);
                }
            }, (e) => {
                console.log(e);
            });
        },
        modifyQuestion: function() {
            console.log("modify the question");
            this.$router.push('/modifyquestion');
        },
        responseQuestion: function() {
            console.log("response the question");
            this.$router.push('/answer');
        }
    },
    template: `
    <Page @loaded="load()" >
        <ActionBar :title="$route.path">
            <NavigationButton text="Back!" android.systemIcon="ic_menu_back" @tap="$router.go(-1);" />
        </ActionBar>
        <StackLayout>
            <TextView editable="false">
                <FormattedString>   
                    <Span text="Title : " fontWeight="Bold" />
                    <Span fontWeight="Bold" >{{ title }}</Span>
                    <Span text="\n" />
                    <Span text="Content : " fontWeight="Bold" />
                    <Span fontWeight="Bold" >{{ content }}</Span>
                    <Span text="\n" />
                    <Span text="Asker : " fontWeight="Bold" />
                    <Span fontWeight="Bold" >{{ askername }}</Span>
                    <Span text="\n" />
                    <Span text="Expertises : " fontWeight="Bold" />
                    <Span fontWeight="Bold" >{{ expertises }}</Span>
                    <Span text="\n" />
                </FormattedString>
            </TextView>
            <Button text="delete" v-if="this.$user_name.val == this.askername" @tap="deleteQuestion()" />
            <Button text="Response" v-if="this.$user_name.val != this.askername && this.$user_id.val != '0' " @tap="responseQuestion()" />
            <Button text="modify" v-if="this.$user_name.val == this.askername" @tap="modifyQuestion()" />
        </StackLayout>
    </Page>
  `
};