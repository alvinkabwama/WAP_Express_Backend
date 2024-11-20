import app from './app';

const PORT: number = 3000;

app.listen(PORT, (): void => {
    console.log(`Server running on http://localhost:${PORT}`);
});
