FROM node:22-alpine

WORKDIR /app

# Копируем только необходимые файлы
COPY package.json package-lock.json ./
RUN npm ci

# Копируем весь проект
COPY . .

# Устанавливаем права на выполнение entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["sh", "/app/entrypoint.sh"]