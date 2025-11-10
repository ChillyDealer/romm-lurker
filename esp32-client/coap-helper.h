void sendValueCoap(Coap coap, const char* topic, const char* value) {
  coap.send(
    server, port, "ps/sensor/temp?clientid=esp32",
    COAP_NONCON,
    COAP_POST,
    NULL, 0,
    (uint8_t*)payload, strlen(payload));
}