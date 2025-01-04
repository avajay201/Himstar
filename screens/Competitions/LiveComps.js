import React from "react";
import { Text } from "react-native";
import {
    getCategories,
    getBanners,
    getCompetitions,
    getTournaments,
  } from '../../actions/ApiActions';

const LiveComps = ()=>{
    const [activeCompetitions, setActiveCompetitions] = useState([]);
    const fetchCompetitions = async (bannerId = '') => {
        setActiveCompetitions([]);
        setTournaments([]);
        const result = await getCompetitions(navigation, bannerId);
        console.log('Comps Data:', result);
        if (result[0] === 200) {
          const activeComps = result[1]['active'];
          setActiveCompetitions(activeComps);
          const upComingComps = result[1]['upcoming'];
          setUpcomingCompetitions(upComingComps);
        }
      };
    return(
        <>
            <Text>Active Comps</Text>
        </>
    );
};

export default LiveComps;
