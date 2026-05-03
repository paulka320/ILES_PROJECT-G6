import { useEffect, useState } from "react";
import API from "../api/axios";

import { Container, Table, Card, Row, Col, } from "react-bootstrap";


const  AdminPlacements = () => {
    
    const [placements, setPlacements] = 
        useState([]);
    
    const fetchPlacements = async () => {

        try {
            const res = 
                await API.get(
                    "internships/admin/placements/"
                );
            setPlacements(res.data);
        } catch (err) {
            console.error (
                "placements Error:",
                err.response || err
            );
        }
    };

    useEffect(() =>{
        fetchPlacements();
    }, []);

}