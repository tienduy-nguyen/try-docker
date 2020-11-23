# Những câu lệnh và các tùy chọn hữu ích trong docker

- [Những câu lệnh và các tùy chọn hữu ích trong docker](#những-câu-lệnh-và-các-tùy-chọn-hữu-ích-trong-docker)
  - [Docker](#docker)
  - [Các câu lệnh thông dụng thường dùng trong docker.](#các-câu-lệnh-thông-dụng-thường-dùng-trong-docker)
    - [docker ps](#docker-ps)
    - [docker pull](#docker-pull)
    - [docker build](#docker-build)
    - [docker run](#docker-run)
    - [docker logs](#docker-logs)
    - [docker volume ls](#docker-volume-ls)
    - [docker rm](#docker-rm)
    - [docker rmi](#docker-rmi)
    - [docker stop](#docker-stop)
  - [Các option thường dùng với `docker run`](#các-option-thường-dùng-với-docker-run)
    - [--detach, -d.](#--detach--d)
    - [--entrypoint.](#--entrypoint)
    - [--env, -e](#--env--e)
    - [--ip](#--ip)
    - [--name](#--name)
    - [--publish, -p | --publish-all, -P.](#--publish--p----publish-all--p)
    - [--rm](#--rm)
    - [--tty, -t](#--tty--t)
    - [--volume, -v](#--volume--v)
    - [--workdir, -w](#--workdir--w)

## Docker

Docker là một tool để build các microservices, cho phép ta có thể tạo các ứng dụng và hệ thống theo kiểu điện toán đám mây.

Trong docker mỗi service có thể coi là một container riêng biệt, nó được tạo vởi việc chạy các image. Một image là một gói thực thi được nó bao gồm tất cả mọi thứ cần để chạy ứng dụng như: code, các thư viện, các biến mội trường, các file cấu hình, các lệnh chạy. Có thể coi một container là một thực thi/một đối tượng của một image khi chạy.

## Các câu lệnh thông dụng thường dùng trong docker.
### docker ps

Dùng để liệt kê ra các container đang chạy. Khi sử dụng với các tham số

**-a/-all**: Liệt kê tất cả các container, kể cả đang chạy hay đã kể thúc -q/-quiet: chỉ liệt kê ra id của các container.

### docker pull

Hầu hết các image sẽ được tạo dựa trên các image cơ sở từ Docker Hub. Docker Hub chứa rất nhiều các image được dựng sẵn, mà ta có thể pull về và dùng mà không cần phải định nghĩa và cấu hình lại từ đầu. Để tải một image cụ thể hoặc một tập hợp image ta dùng docker pull.
```bash
docker pull nginx
docker pull mysql
```
### docker build

Lệnh này dùng để build một image từ Dockerfile và context. Context ở đây là một tập file được xác đinh bởi đường dẫn hoặc url cụ thể. Ta có thể sử dụng thêm tham số -t để gắn nhãn cho image.

```bash
docker build -t your_name_container
```
### docker run

Lệnh này dùng để chạy một container dựa trên một image mà ta có sẵn. Ta có thể thêm vào sau lệnh này một vài câu lệnh khác như -it bash để chạy bash từ container này.
```bash
docker run image_name -it bash
```
### docker logs

Lệnh này được sử dụng để hiển thị logs của một container, ta cần phải chỉ rõ container để hiển thị logs thông qua tên của nó. Ngoài cũng có thể sử dụng thêm một số flag như --follow để giữ việc theo dõi logs.

```bash
docker logs --follow your_name_container
```

### docker volume ls

Lệnh này dùng để liệt kê ra các volumn mà các container sử dụng, volume là một cơ chế dùng để lưu trữ dữ liệu sinh ra và sử dụng bởi Docker.

### docker rm
Lệnh này dùng để xóa một hoặc nhiều container.
```bash
docker rm <list_container_name_or_id>
# Remove all container
docker rm $(docker ps -a -q)
# Remove all images
docker system prune
docker system prune -a
```

### docker rmi
Lệnh này dùng để xóa một hoặc nhiều images.

```bash
docker rmi <list_image_id>
```

### docker stop
Lệnh này dùng để stop một hoặc nhiều container. Ngoài ra ta có thể dung docker kill để bắt buộc container dừng lại.

```bash
docker stop <list_container_name_or_id>

```
## Các option thường dùng với `docker run`
Trong các lệnh trên có lẽ docker run là lệnh hữu ích nhất và ta sẽ thường sử dụng nhất. Nó sử dụng để tạo container dựa vào một image cụ thể. Có nhiều option có thể sử dụng với docker run.

### --detach, -d.
Mặc định docker container chạy thì mọi input, output, lỗi được hiện thị trực tiếp trên màn hình terminal. Tuy nhiên với tùy chọn --detach/-d, container sẽ được chạy ngầm vì vậy mọi output, lỗi sẽ không hiển thị.

### --entrypoint.
Thiết lập hoặc ghi đè các lệnh mặc định khi chạy images. Entrypoint là một tập các lệnh và tham số sẽ chạy đầu tiên khi container được chạy từ image. Bất kỳ câu lệnh và tham số được truyền vào sau docker run sẽ được nối vào entrypoint.

### --env, -e
Thiết lập biến môi trường sử dụng cặp (key=value). Nếu ta có biến môi trường trong file ta có thể truền nó vào file bằng tùy chọn --env-file.

### --ip
Khai báo địa chỉ IP cho container

### --name
Gắn tên cho container

### --publish, -p | --publish-all, -P.
Do các container của docker được gộp và chạy trong một network riêng nên nó sẽ độc lập với máy chủ mà docker chạy trên đó. Để mở các cổng của network các container và ánh xạ nó với cổng của máy host ta sử dụng tùy chọn --publish, -p. Hoặc sử dụng --publish-all, -P sẽ mở tất cả các cổng của container.

```bash
docker run --publish 80:80 <image_name> bash
```

### --rm
Tự động xóa container khi nó thoát.

### --tty, -t
Cấp một terminal ảo cho container. Tùy chọn này thường được sử dụng với --interactive, -i giúp cho STDIN mở ngay cả khi container chạy ở dạng ngầm.

### --volume, -v
Gắn một volume vào một container, cho phép chúng ta thao tác ở container nhưng dữ liệu vẫn được lưu trữ ở máy chủ.

```bash
docker run --volume /volume_name <image_name> bash
```

### --workdir, -w
Chỉ định thư mục sẽ làm việc bên trong container. Giả sử ta sẽ làm việc với thư mục app trong docker

```bash
docker run --workdir /app <image_name> bash
```