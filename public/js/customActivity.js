define(["postmonger"], function (Postmonger) {
  "use strict";

  var connection = new Postmonger.Session();
  var authTokens = {};
  var payload = {};
  $(window).ready(onRender);
  document.getElementById("done").removeAttribute("disabled");
  console.log(document.getElementById("title"))

  connection.on("initActivity", initialize);
  connection.on("requestedTokens", onGetTokens);
  connection.on("requestedEndpoints", onGetEndpoints);
  connection.on("requestedInteraction", onRequestedInteraction);
  connection.on(
    "requestedTriggerEventDefinition",
    onRequestedTriggerEventDefinition
  );
  connection.on("requestedDataSources", onRequestedDataSources);

  document.getElementById("done").addEventListener("click", save);

  function onRender() {
    // JB will respond the first time 'ready' is called with 'initActivity'
    connection.trigger("ready");
    connection.trigger("initActivity");
    connection.trigger("requestTokens");
    connection.trigger("requestEndpoints");
    connection.trigger("requestInteraction");
    connection.trigger("requestTriggerEventDefinition");
    connection.trigger("requestDataSources");
  }

  function onRequestedDataSources(dataSources) {
    console.log("*** requestedDataSources ***");
    console.log(dataSources);
  }

  function onRequestedInteraction(interaction) {
    console.log("*** requestedInteraction ***");
    console.log(interaction);
  }

  function onRequestedTriggerEventDefinition(eventDefinitionModel) {
    console.log("*** requestedTriggerEventDefinition ***");
    console.log(eventDefinitionModel);
  }

  function initialize(data) {
    console.log("*** initialize ***");
    console.log(data);
    if (data) {
      payload = data;
    }

    var hasInArguments = Boolean(
      payload["arguments"] &&
        payload["arguments"].execute &&
        payload["arguments"].execute.inArguments &&
        payload["arguments"].execute.inArguments.length > 0
    );

    var inArguments = hasInArguments
      ? payload["arguments"].execute.inArguments
      : {};

    console.log(inArguments);
    const params = [];

    $.each(inArguments, function (index, inArgument) {
      $.each(inArgument, function (key, val) {
        console.log(`${key} - ${val}`)
      });
    });

    connection.trigger("updateButton", {
      button: "done",
      text: "done",
      visible: true,
    });
  }

  function onGetTokens(tokens) {
    console.log(tokens);
    authTokens = tokens;
  }

  function onGetEndpoints(endpoints) {
    console.log(endpoints);
  }

  function save() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const product = document.getElementById("product").value;
    const notificationType = document.getElementById("notification-type");
    const icon = document.getElementById("icon").value;
    const option = notificationType.options[notificationType.selectedIndex];
    console.log(title)
    console.log(description)
    console.log(product)
    console.log(option)
    console.log(icon)
    console.log(notificationType.options)
    //activity.metaData.isConfigured = true;

    payload["arguments"].execute.inArguments = [
      {
        title,
        description,
        product,
        icon,
        notificationType: option,
        userId: "{{uuid}}",
        "contactIdentifier": "{{Contact.Key}}"
      },
    ];

    payload["metaData"].isConfigured = true;

    console.log(JSON.stringify(payload));
    connection.trigger("updateActivity", payload);
  }
});
