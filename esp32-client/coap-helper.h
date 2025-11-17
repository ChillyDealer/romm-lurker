void sendValueCoap(Coap& coap, IPAddress server, int port, const char* topic, const char* payload) {
  char url[128];
  snprintf(url, sizeof(url), "ps/%s?clientid=esp32", topic);

  auto resp = coap.send(
    server,
    port,
    url,
    COAP_CON,
    COAP_POST,
    NULL,
    0,
    (uint8_t*)payload,
    strlen(payload));

  Serial.println("Sent message ID i guess:");
  Serial.println(resp);
}