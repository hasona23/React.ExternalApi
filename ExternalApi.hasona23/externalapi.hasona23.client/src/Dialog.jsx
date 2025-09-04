import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    CircularProgress,
    Alert,
    Box,
    Card,
    CardContent,
    Grid,
    Chip,
    Divider,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import {
    Visibility,
    Close,
    ShoppingCart,
    LocalOffer,
    AttachMoney,
    Info,
    ExpandMore
} from '@mui/icons-material';

export const clothesItemTable = () => {
    const [clothes, setclothesItems] = useState([]);
    const [selectedclothesItem, setSelectedclothesItem] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all clothes (DTOs)
    useEffect(() => {
        fetchclothesItems();
    }, []);

    // Add this helper function inside your component
    // Add this helper function inside your component
    const getColorName = (colorObj) => {
        const { r, g, b } = colorObj;

        // Common color mappings based on RGB values
        if (r === 0 && g === 0 && b === 0) return 'Black';
        if (r === 255 && g === 255 && b === 255) return 'White';
        if (r === 255 && g === 0 && b === 0) return 'Red';
        if (r === 0 && g === 255 && b === 0) return 'Green';
        if (r === 0 && g === 0 && b === 255) return 'Blue';
        if (r === 255 && g === 255 && b === 0) return 'Yellow';
        if (r === 255 && g === 165 && b === 0) return 'Orange';
        if (r === 128 && g === 0 && b === 128) return 'Purple';
        if (r === 255 && g === 192 && b === 203) return 'Pink';
        if (r === 165 && g === 42 && b === 42) return 'Brown';
        if (r === 128 && g === 128 && b === 128) return 'Gray';

        // If no exact match, return RGB format
        return `RGB(${r}, ${g}, ${b})`;
    };
    const fetchclothesItems = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('http://localhost:5117/clothes');
            if (!response.ok) 
                throw new Error('Failed to fetch clothes');
            const data = await response.json();
            setclothesItems(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch full clothesItem details by GUID
    const fetchclothesItemDetails = async (guid) => {
        try {
            setDetailsLoading(true);
            setError(null);
           

            const response = await fetch(`http://localhost:5117/clothes/${guid}`);
   
            if (!response.ok) throw new Error('Failed to fetch clothesItem details');

            const data = await response.json();
          

            setSelectedclothesItem(data);
            setIsDialogOpen(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setDetailsLoading(false);
        }
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setSelectedclothesItem(null);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    if (loading && clothes.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
                Clothes
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* clothesItems Table */}
            <TableContainer component={Paper} elevation={2}>
                <Table sx={{ minWidth: 650 }} aria-label="clothes table">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell sx={{ fontWeight: 'bold' }}>Image</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clothes.map((clothesItem) => (
                            <TableRow
                                key={clothesItem.id}
                                sx={{ '&:hover': { backgroundColor: '#fafafa' } }}
                            >
                                <TableCell component="th" scope="row">
                                    <img alt={"clothes Image"} src={`/src/${clothesItem.imageUrl}`}      
                                         style={{
                                        width: '50px',
                                        height: '50px',
                                        objectFit: 'cover',
                                        borderRadius: '4px'}}   />
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <Typography variant="body1" fontWeight="medium">
                                        {clothesItem.name}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="success.main" fontWeight="medium">
                                        {formatCurrency(clothesItem.price)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<Visibility />}
                                        onClick={() => fetchclothesItemDetails(clothesItem.id)}
                                        disabled={detailsLoading}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        {detailsLoading ? 'Loading...' : 'View Details'}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {clothes.length === 0 && !loading && (
                    <Box p={4} textAlign="center">
                        <Typography variant="body1" color="text.secondary">
                            No clothes found
                        </Typography>
                    </Box>
                )}
            </TableContainer>

            {/* clothesItem Details Dialog */}
            <Dialog
                open={isDialogOpen}
                onClose={closeDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { minHeight: '500px' }
                }}
            >
                <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center' }}>
                    <ShoppingCart sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Clothes Item Details
                    </Typography>
                    <IconButton
                        aria-label="close"
                        onClick={closeDialog}
                        sx={{ color: 'grey.500' }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
                    {selectedclothesItem ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                            {/* Product Image - Top */}
                            <Card sx={{ textAlign: 'center' }}>
                                <CardContent>
                                    <Box display="flex" justifyContent="center" mb={2}>
                                        <img
                                            src={`/src/${selectedclothesItem.imageUrl}`}
                                            alt={selectedclothesItem.name}
                                            style={{
                                                width: '300px',
                                                height: '300px',
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                                border: '1px solid #e0e0e0',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Product Image
                                    </Typography>
                                </CardContent>
                            </Card>

                            {/* Product Name */}
                            <Card sx={{ backgroundColor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                                        <LocalOffer sx={{ mr: 1, color: 'primary.main' }} />
                                        <Typography variant="subtitle2" color="primary.main">
                                            Product Name
                                        </Typography>
                                    </Box>
                                    <Typography variant="h5" fontWeight="bold" color="text.primary">
                                        {selectedclothesItem.name}
                                    </Typography>
                                </CardContent>
                            </Card>

                            {/* Price */}
                            <Card sx={{ backgroundColor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                                        <AttachMoney sx={{ mr: 1, color: 'success.main' }} />
                                        <Typography variant="subtitle2" color="success.main">
                                            Price
                                        </Typography>
                                    </Box>
                                    <Typography variant="h4" fontWeight="bold" color="success.main">
                                        {formatCurrency(selectedclothesItem.price)}
                                    </Typography>
                                </CardContent>
                            </Card>

                            {/* Size */}
                            {selectedclothesItem.size && (
                                <Card sx={{ bgcolor: 'secondary.50', border: '1px solid', borderColor: 'secondary.200' }}>
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography variant="subtitle2" color="secondary.main" gutterBottom>
                                            Size
                                        </Typography>
                                        <Chip
                                            label={selectedclothesItem.size}
                                            color="secondary"
                                            variant="filled"
                                            size="large"
                                            sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}
                                        />
                                    </CardContent>
                                </Card>
                            )}

                            {/* Color */}
                            {selectedclothesItem.color && (
                                <Card sx={{ bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.200' }}>
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography variant="subtitle2" color="warning.main" gutterBottom>
                                            Color
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                                            <Typography variant="h6" fontWeight="bold" color="text.primary">
                                                {getColorName(selectedclothesItem.color)}
                                            </Typography>
                                            <Box
                                                sx={{
                                                    width: 32,
                                                    height: 32,
                                                    backgroundColor: `rgb(${selectedclothesItem.color.r}, ${selectedclothesItem.color.g}, ${selectedclothesItem.color.b})`,
                                                    border: '2px solid #000',
                                                    borderRadius: '4px',
                                                    display: 'inline-block'
                                                }}
                                            />
                                        </Box>
                                    </CardContent>
                                </Card>
                            )}
                            {/* Fit */}
                            {selectedclothesItem.fit && (
                                <Card sx={{ bgColor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography variant="subtitle2" color="info.main" gutterBottom>
                                            Fit
                                        </Typography>
                                        <Typography variant="h6" fontWeight="bold" color="text.primary">
                                            {selectedclothesItem.fit}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Description */}
                            {selectedclothesItem.description && (
                                <Card sx={{ mb: 3 }}>
                                    <CardContent>
                                        <Box display="flex" alignItems="center" mb={2}>
                                            <Info sx={{ mr: 1, color: 'info.main' }} />
                                            <Typography variant="h6">Description</Typography>
                                        </Box>
                                        <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                                            {selectedclothesItem.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Timestamps */}
                            {(selectedclothesItem.createdAt || selectedclothesItem.updatedAt) && (
                                <Card sx={{ mb: 3 }}>
                                    <CardContent>
                                        <Box display="flex" alignItems="center" mb={2}>
                                            <Calendar sx={{ mr: 1, color: 'warning.main' }} />
                                            <Typography variant="h6">Timestamps</Typography>
                                        </Box>
                                        <Grid container spacing={2}>
                                            {selectedclothesItem.createdAt && (
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="subtitle2" color="text.secondary">
                                                        Created
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {formatDate(selectedclothesItem.createdAt)}
                                                    </Typography>
                                                </Grid>
                                            )}
                                            {selectedclothesItem.updatedAt && (
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="subtitle2" color="text.secondary">
                                                        Last Updated
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {formatDate(selectedclothesItem.updatedAt)}
                                                    </Typography>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Raw Data Accordion 
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Typography variant="subtitle1">View Raw Data</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                                        <Typography
                                            component="pre"
                                            variant="body2"
                                            sx={{
                                                whiteSpace: 'pre-wrap',
                                                fontFamily: 'monospace',
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            {JSON.stringify(selectedclothesItem, null, 2)}
                                        </Typography>
                                    </Paper>
                                </AccordionDetails>
                            </Accordion>*/}
                        </Box>
                    ) : (
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                            <CircularProgress />
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

