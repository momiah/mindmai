//Response Generator Functions
import { Text } from 'react-native'
import axios from 'axios';
import { API_KEY } from '@env';
const apiKey = API_KEY;

const apiUrl = 'https://api.openai.com/v1/engines/text-davinci-003/completions';

export const handleGenerator = async (message, setResponse) => {

    //const prompt = `Give me the exact ingredients needed for a ${selected} recipe. It should have exactly the following calorie profile: ${protein} grams of protein, ${carbs} grams of carbohydrates, and ${fat} grams of fat. Exclude the following ingredients: ${exclude} and structure this in the following: "name of the recipe", "ingredients", "instructions", "nutritional value for Calories, Protien, Carbs, Fats"`;
    try {
        const response = await axios.post(
            apiUrl,
            {
                prompt: message,
                temperature: 0.6,
                max_tokens: 2048,
            }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
        }
        );
        const responseText = response.data.choices[0].text;
        setResponse(responseText);
        console.log(responseText, 'looool')
    } catch (error) {
        console.error('Error:', error);
    } 
};


export const formatDataWithBoldTags = (response) => {
    let formattedData = response.replace(/Ingredients:/g, '**Ingredients:**');
    formattedData = formattedData.replace(/Instructions:/g, '**Instructions:**');
    formattedData = formattedData.replace(/Nutritional Information/g, '**Nutritional Information**');
    formattedData = formattedData.replace(/Nutritional Value/g, '**Nutritional Information**');
    formattedData = formattedData.replace(/Nutrition Information/g, '**Nutritional Information**');
    formattedData = formattedData.replace(/- [\w\d\s.,-]+/g, '**$&**');
    const formattedTextArray = formattedData.split('**');

    return (
        <Text>
            {formattedTextArray.map((text, index) => {
                if (
                    text === 'Ingredients:' ||
                    text === 'Instructions:' ||
                    text === 'Nutritional Information'
                ) {
                    return (
                        <Text key={index} style={{fontWeight: 'bold'}}>
                            {text}
                        </Text>
                    );
                } else {
                    return <Text key={index}>{text}</Text>;
                }
            })}
        </Text>
    );
};