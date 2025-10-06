#include <WiFi.h>
#include <WiFiUdp.h>
#include <coap-simple.h>
#include <esp_wpa2.h>
#include "secrets.h"

const char* ssid = "eduroam";

IPAddress server(192, 168, 1, 100);
int port = 5683;

WiFiUDP udp;
Coap coap(udp);

void response_callback(CoapPacket &packet, IPAddress ip, int port) {
    Serial.println("[CoAP Response Received]");
    
    char p[packet.payloadlen + 1];
    memcpy(p, packet.payload, packet.payloadlen);
    p[packet.payloadlen] = '\0';

    Serial.print("  Message ID: ");
    Serial.println(packet.messageid);
    Serial.print("  Payload: ");
    Serial.println(p);
}

void setup() {
  Serial.begin(115200);
  Serial.println("\n[CoAP Client - hirotakaster Library - Final Corrected Version]");

  WiFi.disconnect(true);
  delay(1000);

  WiFi.mode(WIFI_STA);
  esp_wifi_sta_wpa2_ent_set_identity((uint8_t *)username, strlen(username));
  esp_wifi_sta_wpa2_ent_set_username((uint8_t *)username, strlen(username));
  esp_wifi_sta_wpa2_ent_set_password((uint8_t *)password, strlen(password));
  esp_wifi_sta_wpa2_ent_set_ca_cert(NULL, 0);
  esp_wifi_sta_wpa2_ent_enable();
  WiFi.begin(ssid);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".:");
  }
  Serial.println("\nWiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  coap.response(response_callback);

  coap.start();
}

void loop() {
  char payload[] = "25.5";
  
  Serial.println("\nSending CoAP POST request to /sensor/temp...");
  
  // Use coap.send() to construct and send the packet.
  // This is non-blocking. The response will be handled by the callback.
  coap.send(server, port, "sensor/temp", COAP_CON, COAP_POST, (uint8_t*)payload, strlen(payload), NULL, 0);

  // coap.loop() is ESSENTIAL. It processes incoming packets and triggers the callback.
  // We can call it multiple times to be more responsive.
  for (int i = 0; i < 100; i++) {
    coap.loop();
    delay(10);
  }

  // Wait before sending the next packet
  delay(9000); 
}