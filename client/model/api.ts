export type BaseWebSocketMessage<Payload = unknown> = MessageEvent<{
  type: string;
  payload: Payload;
}>;
