import { useEffect, useState, useCallback } from 'react';
import mqtt, { MqttClient } from 'mqtt';

interface MqttConfig { // params
  host: string;
  port: number;
  protocol: 'ws' | 'wss';
  username?: string;
  password?: string;
  path?: string;
}

// hook for mqtt
interface UseMqttReturn {
  client: MqttClient | null;
  connectionStatus: 'Disconnected' | 'Connecting' | 'Connected' | 'Reconnecting' | 'Error';
  subscribe: (topic: string, qos?: 0 | 1 | 2) => Promise<boolean>;
  unsubscribe: (topic: string) => Promise<boolean>;
  publish: (topic: string, message: string, qos?: 0 | 1 | 2) => Promise<boolean>;
  lastMessage: { topic: string; message: string } | null;
}

// hook for mqtt connection and actions
export const useMQTT = (config: MqttConfig): UseMqttReturn => {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<UseMqttReturn['connectionStatus']>('Disconnected');
  const [lastMessage, setLastMessage] = useState<{ topic: string; message: string } | null>(null);

  useEffect(() => {
    const connectOptions = {
      username: config.username,
      password: config.password,
      clientId: `react_client_${Math.random().toString(16).substr(2, 8)}`,
      keepalive: 60,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 4000,
    };

    const url = `${config.protocol}://${config.host}:${config.port}${config.path || '/mqtt'}`;
    
    console.log('Connecting to MQTT broker:', url);
    setConnectionStatus('Connecting');
    
    const mqttClient = mqtt.connect(url, connectOptions);

    mqttClient.on('connect', () => {
      console.log('mqtt connected');
      setConnectionStatus('Connected');
      setClient(mqttClient);
    });

    mqttClient.on('error', (err) => {
      console.error('error: ', err);
      setConnectionStatus('Error');
    });

    mqttClient.on('offline', () => {
      console.log('mqtt down');
      setConnectionStatus('Disconnected');
    });

    mqttClient.on('reconnect', () => {
      console.log('mqtt is reconnecting');
      setConnectionStatus('Reconnecting');
    });

    mqttClient.on('message', (topic, payload) => {
      const message = payload.toString();
      console.log(`msg: ${topic}:`, message);
      setLastMessage({ topic, message });
    });

    return () => {
      if (mqttClient.connected) {
        mqttClient.end();
        console.log('mqtt disconnected');
      }
    };
  }, [config.host, config.port, config.protocol, config.username, config.password, config.path]);

  const subscribe = useCallback(async (topic: string, qos: 0 | 1 | 2 = 0): Promise<boolean> => {
    return new Promise((resolve) => {
      if (client && client.connected) {
        client.subscribe(topic, { qos }, (err) => {
          if (err) {
            console.error('error:', err);
            resolve(false);
          } else {
            console.log(`subscribed: ${topic}`);
            resolve(true);
          }
        });
      } else {
        resolve(false);
      }
    });
  }, [client]);

  const unsubscribe = useCallback(async (topic: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (client && client.connected) {
        client.unsubscribe(topic, (err) => {
          if (err) {
            console.error('error:', err);
            resolve(false);
          } else {
            console.log(`unsubscribed: ${topic}`);
            resolve(true);
          }
        });
      } else {
        resolve(false);
      }
    });
  }, [client]);

  const publish = useCallback(async (topic: string, message: string, qos: 0 | 1 | 2 = 0): Promise<boolean> => {
    return new Promise((resolve) => {
      if (client && client.connected) {
        client.publish(topic, message, { qos }, (err) => {
          if (err) {
            console.error('error: ', err);
            resolve(false);
          } else {
            console.log(`published: ${topic}:`, message);
            resolve(true);
          }
        });
      } else {
        resolve(false);
      }
    });
  }, [client]);

  return {
    client,
    connectionStatus,
    subscribe,
    unsubscribe,
    publish,
    lastMessage,
  };
};