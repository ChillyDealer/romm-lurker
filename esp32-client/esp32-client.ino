#include <WiFi.h>
#include <WiFiUdp.h>
#include <coap-simple.h>
#include <esp_wpa2.h>
#include "secrets.h"
#include "sound.h"

// Der kommer deprecated besked om wifi ved compile, bare ignorer

const char* ssid = "ohhhhhh";
const char* password = "123burger";


IPAddress server(192, 168, 137, 154);
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
  WiFi.begin(ssid, password);

  Serial.print("MAC Address: ");
  Serial.println(WiFi.macAddress());

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".:");
  }
  Serial.println("\nWiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  
  coap.response(response_callback);

  coap.start();

  initSound();
}

void loop() {
  char payload[] = "25.5";
  
  if (readSound()) {
    Serial.println("I GOT SOUND!!");
  }

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
  delay(1000); 
}