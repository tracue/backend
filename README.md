# Tracue Backend API

Tracue is an open-source movie tracking website, created for cinephiles.

At its core, it's a **[GraphQL](https://graphql.org/)** API that uses the [TheMovieDatabase](https://www.themoviedb.org/) API as an external data source and manages the internal data on a **[PostgreSQL](https://www.postgresql.org/)** database using **[Prisma](https://www.prisma.io/)**.

## Setup

### Cloning and Installing The Dependencies

Clone the repository to your local machine:

```bash
git clone https://github.com/tracue/backend
```

Install the dependencies:

```bash
npm install
```

### Environment Setup

Create a file called `.env` in the root folder of the project and fill in the information as shown below:

```
# .env
DATABASE_URL="postgresql://<DB_USERNAME>:<DB_USER_PASSWORD>@localhost:5432/<DB_NAME>?schema=public"
SECRET_KEY=<YOUR SECRET>
TMDB_KEY=<YOUR TMDB API KEY>
```

> Fields `<DB_USERNAME>`, `<DB_USER_PASSWORD>` and `<DB_NAME>` are your database's username, the password to the corresponding user and the name of the database respectively. (You may need to change the address to your database as well depending on the environment you're running PostgreSQL on.)

> `<YOUR SECRET>` is a secret used to encrypt passwords in the database and it is recommended that you use a strong combination of letters, numbers, etc. here.

> `<YOUR TMDB API KEY>` is your personal _TMDB API KEY_ which can be created and retrieved as instructed [here](https://developers.themoviedb.org/3/getting-started/introduction).

After you have successfully configured your environment you can run the following command to set up your database based on the schema:

```bash
npx prisma db push
```

### Starting the server

You can now start the server using the following command:

```bash
npm run start
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE.md)
