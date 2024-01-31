import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import { Grid } from '@mui/material';
import { wordsArray } from "./wordsArray.js"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';

import axios from 'axios';
import { purple, red } from '@mui/material/colors';

const primary = red[500]; // #f44336
const accent = purple['A200']; // #e040fb



export default function SearchPage() {
    const [myword, setMyword] = React.useState("");
    const [top10Words, setTop10Words] = React.useState([]);
    const [mywordDefi, setMywordDefi] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    function calculateLevenshteinDistance(a, b) {
        const distanceMatrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

        for (let i = 0; i <= a.length; i++) {
            distanceMatrix[0][i] = i;
        }

        for (let j = 0; j <= b.length; j++) {
            distanceMatrix[j][0] = j;
        }

        for (let j = 1; j <= b.length; j++) {
            for (let i = 1; i <= a.length; i++) {
                const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
                distanceMatrix[j][i] = Math.min(
                    distanceMatrix[j - 1][i] + 1,
                    distanceMatrix[j][i - 1] + 1,
                    distanceMatrix[j - 1][i - 1] + indicator
                );
            }
        }

        return distanceMatrix[b.length][a.length];
    }




    React.useEffect(() => {

        const similarWords = wordsArray
            .map(word => ({ word, similarity: calculateLevenshteinDistance(myword, word) }))
            .sort((a, b) => a.similarity - b.similarity)
            .slice(0, 11)
            .map(result => result.word);

        if (myword != "") {
            setTop10Words(similarWords);
        }

    }, [myword]);

    const searchHandler = () => {
        setLoading(true);
        axios.get(`https://api.urbandictionary.com/v0/define?term=${myword}`)
            .then(function (res) {
                console.log(res.data);
                if (res.data.list.length > 0) {
                    setMywordDefi(res.data.list[0].definition);
                } else {
                    setMywordDefi("No definition found");
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                setMywordDefi("Error fetching data");
            })
            .finally(function () {
                setLoading(false);
            });
        if (wordsArray.includes(myword) == false) {
            wordsArray.push(myword)
        }
    }

    return (
        <>
            <div style={{ height: "800px" }}>
                <Card sx={{ maxWidth: "50%", margin: "56px auto", padding: "20px", backgroundColor: "#1F2029" }}>
                    <Typography variant="h3" component="h1" gutterBottom style={{ color: "green" }}>
                        Word Word
                    </Typography>

                    <Grid>
                        <Autocomplete
                            freeSolo
                            id="free-solo-2-demo"
                            disableClearable
                            options={top10Words.map((option) => option)}
                            renderInput={(params) => (
                                <TextField
                                    onChange={(e) => { setMyword(e.target.value) }}
                                    {...params}
                                    color="success"
                                    focused
                                    label="Search input ."
                                    InputProps={{
                                        ...params.InputProps,
                                        type: 'search',
                                        style: { fontFamily: 'nunito', color: '#fff', borderColor: "red" } // Change to your desired border color
                                    }}
                                />
                            )}
                        />
                    </Grid>



                    <Button variant="outlined" onClick={searchHandler} style={{ marginTop: "6px" }} color="success">Search</Button>

                    <CardActionArea>
                        <CardContent>
                            {loading ? (
                                <Typography variant="body2" color="#fff">
                                    Loading...
                                </Typography>
                            ) : (
                                <Typography variant="body2" color="#fff">
                                    {mywordDefi}
                                </Typography>
                            )}
                        </CardContent>
                    </CardActionArea>

                </Card>

            </div>
        </>
    );
}
