FROM python
WORKDIR /app
ENV FILE_CONTENT="data=input('Enter a number: ')\\nprint('You entered: ', data)\\ndata=input('Enter a number: ')\\nprint('You entered: ', data)"
ENV FILE_NAME="main"
ENV FILE_INPUT="hello\nyou\n"
CMD ["/bin/bash", "-c", "echo -e $FILE_CONTENT > ${FILE_NAME}.py && echo -n -e $FILE_INPUT | python3 ${FILE_NAME}.py"]

