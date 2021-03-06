const httpModule = require("http");
module.exports = {
    data() {
        return {
            apiUrl: "http://140.114.79.86:8000/api/questions/",
            questionlist: [],
        }
    },
    methods: {
        load: function() {
            console.log("Load question");

            httpModule.request({
                url: this.apiUrl,
                method: "GET",
                headers: { "Content-Type": "application/json" }
            }).then((response) => {
                const result = response.content.toJSON();
            
                for (var i = 0; i < result.length; i++) {
                    var tmp_data = {
                        title: result[i].title,
                        qid: result[i].question_id,
                        uid: result[i].user_id
                    };
                    this.questionlist.push(tmp_data);
                }
            }, (e) => {
                console.log(e);
            });
        },
        onItemTap: function(args) {
            console.log(args.item.qid);
            this.$cur_qid.val = args.item.qid;
            this.$router.push('/showquestion');
        }
    },
    template: `
    <Page @loaded="load()">
        <ActionBar :title="$route.path">
            <NavigationButton text="Back!" android.systemIcon="ic_menu_back" @tap="$router.go(-1);" />
        </ActionBar>
        <StackLayout>
            <ListView class="list-group" for="question in questionlist" @itemTap="onItemTap" style="height:1250px width:60px">
                <v-template>
                    <FlexboxLayout flexDirection="row" class="list-group-item">
                    <Label :text="question.title" class="list-group-item-heading" style="width: 60%" />
                    </FlexboxLayout>
                </v-template>
            </ListView>
        </StackLayout>
    </Page>
  `
};