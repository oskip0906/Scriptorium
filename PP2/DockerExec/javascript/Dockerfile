FROM node:latest
WORKDIR /app
ENV FILE_CONTENT=""
ENV FILE_NAME="main"
ENV FILE_INPUT=""
ENTRYPOINT [ "timeout", "15" ]
CMD ["/bin/bash", "-c", "echo -e $FILE_CONTENT > ${FILE_NAME}.js && echo -n -e $FILE_INPUT | node $FILE_NAME"]