import express, { Router } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import serverless from "serverless-http";

dotenv.config();

const app = express();
const port = process.env.PORT;

const recipeJSON = '[{"id":"0001","type":"dessert","name":"Fudgy Brownies","preparation time":"60 minutes (1 hour)","steps":{"step01":{"name":"Brownie Base","ingredients":[{"name":"Butter","quantity":"5 oz"},{"name":"Sugar","quantity":"1 Cup"},{"name":"Eggs","quantity":"2"},{"name":"Instant Espresso Powder ","quantity":"2 tsp"},{"name":"Warm Water","quantity":"2 Tbsp"},{"name":"Vanilla Extract","quantity":"2 tsp"},{"name":"Chocolate (Melted)","quantity":"7 oz"},{"name":"Cocoa Powder","quantity":"3 Tbsp"},{"name":"Flour","quantity":"1 Cup"},{"name":"Chocolate Chips","quantity":"1/2 Cup"},{"name":"Chopped Nuts","quantity":"1/2 Cup"}]},"step02":{"name":"Ganache Topping","ingredients":[{"name":"Butter","quantity":"2 Tbsp"},{"name":"Heavy Cream","quantity":"1 Cup"},{"name":"Chopped Chocolate","quantity":"170g"}]}}},{"id":"0002","type":"dessert","name":"French Eclairs","preparation time":"140 minutes (2 hours & 20 minutes)","steps":{"step01":{"name":"Choux Pastry","ingredients":[{"name":"Butter","quantity":"115g"},{"name":"Water","quantity":"1 Cup"},{"name":"Flour","quantity":"1 Cup"},{"name":"Eggs","quantity":"4"}]},"step02":{"name":"Pastry Cream","ingredients":[{"name":"Egg Yolks","quantity":"4"},{"name":"Cornflour ","quantity":"1/3 Cup"},{"name":"Milk ","quantity":"2 & 1/4 Cup"},{"name":"Vanilla Extract ","quantity":"2 tsp"},{"name":"Sugar ","quantity":"1/3 Cup"},{"name":"Butter ","quantity":"2 Tbsp"}]},"step03":{"name":"Ganache Topping","ingredients":[{"name":"Heavy Cream","quantity":"500 ml"},{"name":"Butter","quantity":"2 Tbsp"},{"name":"Chopped Chocolate","quantity":"340g"}]}}},{"id":"0003","type":"dessert","name":"Twix Bars","preparation time":"90 minutes (1 hour & 30 minutes)","steps":{"step01":{"name":"Shortbread Crust","ingredients":[{"name":"Butter","quantity":"230g"},{"name":"Sugar","quantity":"60g"},{"name":"Flour","quantity":"320g"}]},"step02":{"name":"Caramel Layer","ingredients":[{"name":"Condensed Milk","quantity":"1 Can (approximately 400g)"},{"name":"Brown Sugar ","quantity":"50g"},{"name":"Butter ","quantity":"45g"},{"name":"Vanilla Extract ","quantity":"1 tsp"},{"name":"Salt ","quantity":"1/2 tsp"}]},"step03":{"name":"Chocolate Topping","ingredients":[{"name":"Butter","quantity":"2 Tbsp"},{"name":"Chopped Chocolate","quantity":"200g"}]}}}]'
const methodJSON = '[{"id":"0001","type":"dessert","name":"Fudgy Brownies","preparation time":"60 minutes (1 hour)","methods":{"step01":{"name":"Brownie Base","method":[{"name":"Mix butter and sugar until smooth."},{"name":"Mix espresso powder with warm water in a separate bowl."},{"name":"Mix the eggs into the butter and sugar mixture one at a time. "},{"name":"Mix flour with cocoa powder in a separate bowl. "},{"name":"Add the mixed espresso and vanilla to the butter mixture and stir well."},{"name":"Pour the melted chocolate to this mixture and incorporate well."},{"name":"Gently stir in the mixed flour, choclate chips and chopped nuts until they are evenly incorporated with the mixture. "},{"name":"Preheat the oven to 175 degrees Celcius"},{"name":"Transfer the mixture onto a tray lined with parchment paper and bake for 40 minutes."},{"name":"Allow the brownies to cool completely before cutting them to your preffered size."}]},"step02":{"name":"Ganache Topping","method":[{"name":"Add the butter and chopped chocolate in a bowl."},{"name":"Heat the heavy cream in a saucepan till it simmers."},{"name":"Pour the heated heavy cream over the butter and chocolate and let it rest for about 5 minutes. "},{"name":"Stir the ganache until its well-combined and smooth."},{"name":"Dip the cut brownies with ganache and serve."}]}}},{"id":"0002","type":"dessert","name":"French Eclairs","preparation time":"140 minutes (2 hours & 20 minutes)","methods":{"step01":{"name":"Choux Pastry","method":[{"name":"Add water and butter to a pan and heat till it simmers."},{"name":"Remove the pan from the stove and mix in the flour till it forms a dough."},{"name":"Heat the dough on low heat for about 5 minutes while mixing it well and then let it cool down completely. "},{"name":"Mix the eggs to the dough one at a time by stirring them in well."},{"name":"Pipe the mixture onto a baking sheet lined with parchment paper and brush the eclairs with water."},{"name":"preheat the oven to 210 degrees Celcius, and bake the eclairs for 10 minutes. Reduce the temperature to 180 degrees Celcius and bake for another 20 minutes."},{"name":"After baking, remove the eclairs from the parchment paper and make holes at their base to pipe in the pastry cream."}]},"step02":{"name":"Pastry Cream","method":[{"name":"Combine the sugar, cornstarch, and vanilla extract with the egg yolks."},{"name":"Add 1/2 cup milk to the egg yolk mixture and stir well. "},{"name":"Add remaining milk and the egg yolk mixture in a saucepan and cook over medium heat."},{"name":"When the pastry cream thickens and starts bubbling, mix in the butter."},{"name":"Pour the pastry cream onto a bowl, line the top with cling film, and refrigerate it until it cools down. "},{"name":"Pipe the eclairs with the chilled pastry cream."}]},"step03":{"name":"Ganache Topping","method":[{"name":"Add  butter and chopped chocolocate in a bowl."},{"name":"Heat the heavy cream in a saucepan till it simmers."},{"name":"Pour the heated heavy cream over the chocolate and let it rest for about 5 to 10 minutes before stirring it till it becomes smooth."},{"name":"Dip the pastry cream-filled eclairs with the ganache and serve."}]}}},{"id":"0003","type":"dessert","name":"Twix Bars","preparation time":"90 minutes (1 hour & 30 minutes)","methods":{"step01":{"name":"Shortbread Crust","method":[{"name":"Cream the butter and sugar in a large bowl until it becomes light and fluffy."},{"name":"Incorporate the flour into the butter mixture until the mixture becomes crumbly, yet holds together when pressed."},{"name":"Press the mixture onto a parchment-lined tray and level it using a spoon. use a fork to mark holes randomly on the crust after levelling it."},{"name":"Preheat the oven to 180 degrees Celcius and bake the crust for 20-25 minutes."}]},"step02":{"name":"Caramel Layer","method":[{"name":"Place all the ingredients in a saucepan and cook over medium heat."},{"name":"Stir continuously until the mixture boils and and keep cooking it for 5 more minutes after it starts boiling. "},{"name":"Pour the prepared caramel over the crust and bake it for another 12-15 minutes at 180 degrees Celcius.  "}]},"step03":{"name":"Chocolate Topping","method":[{"name":"Melt the chocolate and butter over a double boiler."},{"name":"After the baked caramel and crust cools slightly, spread the chocolate topping evenly and refrigerate it until the chocolate sets, before cutting them."}]}}}]'


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

let data;
let instructions;

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render("index", {recipe: data, guideline: instructions});
});

app.post("/fetchRecipeAndGuidline", (req, res) => {
    const choice = req.body.choice;
    switch(choice) {
        case "brownie":
            data = JSON.parse(recipeJSON)[0];
            instructions = JSON.parse(methodJSON)[0];
            break;
        case "eclair":
            data = JSON.parse(recipeJSON)[1];
            instructions = JSON.parse(methodJSON)[1];

            break;
        case "twix-bar":
            data = JSON.parse(recipeJSON)[2];
            instructions = JSON.parse(methodJSON)[2];

            break;
        default:
            data = {};
            instructions = {};
            break;
    }
    res.redirect("/");
});

// app.post("/guideline", (req, res) => {
//     switch(req.body.choice) {
//         case "brownie":
//             instructions = JSON.parse(methodJSON)[0];
//             break;
//         case "eclair":
//             instructions = JSON.parse(methodJSON)[1];
//             break;
//         case "twix-bar":
//             instructions = JSON.parse(methodJSON)[2];
//             break;
//         default:
//             break;
//     }
//     res.redirect("/");
// });

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
})

app.use('/.netlify/api/index.js', router);
module.exports.handler = serverless(app);

// module.exports = app;
// module.exports.handler = serverless(app);

