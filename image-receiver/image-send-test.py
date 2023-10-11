import socket

SECRET_KEY = "cmjBpNGRYyT1FVynDPioDNrGbQUikYkM"

def send_image(host, port, image_path):
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    try:
        client_socket.connect((host, port))
        print(f"Connected to {host}:{port}")

        client_socket.send(SECRET_KEY.encode("utf-8"))

        with open(image_path, 'rb') as file:
            while True:
                data = file.read(1024)
                if not data:
                    break
                client_socket.send(data)

        print(f"Image sent successfully: {image_path}")

    finally:
        client_socket.close()

if __name__ == "__main__":
    host = '18.220.103.162'
    port = 5051
    image_path = 'image.jpeg'

    send_image(host, port, image_path)