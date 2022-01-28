docker stop ritzkick

docker container prune -f

docker build -t  img_ritzkick -f ./Dockerfile .

docker run -d -p 3000:3000 --name ritzkick img_ritzkick
