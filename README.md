# Frankendao

This project has a Gnosis angular multisig wallet app inside of the dapp/ folder and a react-create-app Althea DAO in dapp/node-list

To run the dev servers:

    npm start

The react app is loaded into the Gnosis angular app using an angular directive in dapp/directives.js
This places a <script> tag into the partial file at dapp/partials/althea.html to load the React javascript which then attaches itself to the <div id="althea-app"> in the partial.
