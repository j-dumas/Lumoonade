docker stop ritzkick
docker stop ritzkick-test

docker container prune -f

docker image prune -f

docker build -t  img_ritzkick -f ./docker/Dockerfile .
docker build -t  img_ritzkick_test -f ./docker/DockerfileTest .

docker run -d -p 443:443 --name ritzkick img_ritzkick
docker run -d -p 80:80 --name ritzkick-test img_ritzkick_test