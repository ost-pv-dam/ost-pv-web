import socket
import threading

KEY = "IPQRph00_towrY9jxyFxtw"


def handle_client(client_socket, clients):
    try:
        data = client_socket.recv(1024).decode("utf-8")
        if data.startswith(KEY):
            clients.append(client_socket)
            print(f"New client joined. Total clients: {len(clients)}")

            while True:
                data = client_socket.recv(1024).decode("utf-8")
                print("message received: " + data)

                # If the client disconnects, remove it from the list and break the loop
                if not data or not data.startswith(KEY):
                    clients.remove(client_socket)
                    print(f"Client disconnected. Total clients: {len(clients)}")
                    break

                # Repeat the message to all connected clients
                for c in clients:
                    if c != client_socket:
                        c.send(data[len(KEY) :].encode("utf-8"))

    except Exception as e:
        print(f"Error: {e}")
        clients.remove(client_socket)


def start_server():
    host = "0.0.0.0"
    port = 5051

    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind((host, port))
    server_socket.listen(5)

    print(f"Server listening on {host}:{port}")

    clients = []

    try:
        while True:
            client_socket, addr = server_socket.accept()

            # Start a new thread to handle the client
            client_handler = threading.Thread(
                target=handle_client, args=(client_socket, clients)
            )
            client_handler.start()

    except KeyboardInterrupt:
        print("Server shutting down.")
        server_socket.close()


if __name__ == "__main__":
    start_server()
