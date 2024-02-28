    How to run:

    1 - copy .env.sample to .env

    2 - Start docker.
        docker-compose -f docker-compose.dev.yml up

    3 - Start the migration in the container.
        npm run migration:run

