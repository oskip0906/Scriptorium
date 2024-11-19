FROM python
WORKDIR /app
ENV FILE_CONTENT="# Type your code here\nif True:\n        print(\"hi\")"
ENV FILE_NAME="main"
ENV FILE_INPUT=""
CMD ["/bin/bash", "-c", "echo -e \"$FILE_CONTENT\" > ${FILE_NAME}.py && echo -n -e \"$FILE_INPUT\" | python3 ${FILE_NAME}.py"]

