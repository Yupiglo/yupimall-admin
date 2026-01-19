"use client";

import { useContext, useState } from "react";
import {
    Box,
    Button,
    Menu,
    MenuItem,
    Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { CurrencyContext } from "@/helpers/currency/CurrencyContext";

export default function CurrencySelector() {
    const { selectedCurr, selectedCurrency, currencies } = useContext(CurrencyContext);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelect = (currency: typeof currencies[0]) => {
        selectedCurrency(currency);
        handleClose();
    };

    return (
        <Box>
            <Button
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{
                    color: "text.primary",
                    textTransform: "none",
                    minWidth: 100,
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 2,
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                    "&:hover": {
                        bgcolor: "action.hover",
                    },
                }}
            >
                <Typography component="span" sx={{ fontSize: "1.1rem", mr: 0.75 }}>
                    {selectedCurr.flag}
                </Typography>
                <Typography component="span" sx={{ fontWeight: 500, fontSize: "0.875rem" }}>
                    {selectedCurr.currency}
                </Typography>
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        maxHeight: 320,
                        minWidth: 160,
                    },
                }}
            >
                {currencies.map((curr) => (
                    <MenuItem
                        key={curr.currency}
                        onClick={() => handleSelect(curr)}
                        selected={curr.currency === selectedCurr.currency}
                        sx={{
                            py: 1,
                            px: 2,
                        }}
                    >
                        <Typography component="span" sx={{ fontSize: "1.1rem", mr: 1.5 }}>
                            {curr.flag}
                        </Typography>
                        <Typography component="span" sx={{ fontWeight: 500, mr: 1 }}>
                            {curr.currency}
                        </Typography>
                        <Typography component="span" sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
                            ({curr.symbol})
                        </Typography>
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
}
