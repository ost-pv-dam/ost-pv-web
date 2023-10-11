import socket
import os
import time

SECRET_KEY = "cmjBpNGRYyT1FVynDPioDNrGbQUikYkM" # TODO: move to env var
TEMP_DIR = "tmp"

class AuthenticationError(Exception):
    def __init__(self, message="Incorrect key"):
        self.message = message
        super().__init__(self.message)

def receive_images(host, port):
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    server_socket.bind((host, port))
    server_socket.listen(1)
    print(f"Listening on {host}:{port}...")


    while True:
        client_socket, client_address = server_socket.accept()
        print(f"Connection from {client_address}")

        try:
            secret = client_socket.recv(32).decode("utf-8")
            if secret != SECRET_KEY:
                raise AuthenticationError()

            print("authenticated")

            filename = TEMP_DIR + os.path.sep + f"{int(time.time())}.jpg"

            with open(filename, 'wb') as file:
                while True:
                    data = client_socket.recv(1024)
                    if not data:
                        break
                    file.write(data)

            print(f"Image {filename} received and saved")

        except Exception as e:
            print(f"Error receiving image: {e}")

        finally:
            client_socket.close()

if __name__ == "__main__":
    host = '127.0.0.1'  
    port = 5051         

    os.makedirs(TEMP_DIR, exist_ok=True)
    receive_images(host, port)