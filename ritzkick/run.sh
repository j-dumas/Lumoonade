docker stop ritzkick

docker container prune -f

docker image prune -f

docker build -t  img_ritzkick -f ./Dockerfile .

docker run -d -p 443:443 -p 80:80 --name ritzkick img_ritzkick
