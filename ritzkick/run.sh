docker stop ritzkick
docker stop ritzkick-test

docker container prune -f

docker image prune -f

docker build -t  img_ritzkick -f ./docker/Dockerfile .
docker build -t  img_ritzkick_test -f ./docker/DockerfileTest .

docker run --log-opt max-size=100m --log-opt max-file=5 -d -p 443:443 --name ritzkick img_ritzkick
docker run --log-opt max-size=100m --log-opt max-file=5 -d -p 4000:4000 --name ritzkick-test img_ritzkick_test