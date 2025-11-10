void sendValueCoap(Coap coap, const char* topic, const char* payload) {
  char url[128];
  snprintf(url, sizeof(url), "ps/%s?clientid=esp32", topic);

  coap.send(
    server,
    port,
    url,
    COAP_NONCON,
    COAP_POST,
    NULL,
    0,
    (uint8_t*)payload,
    strlen(payload));
}