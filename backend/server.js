// D.E.T CONTACT GAIN - Backend Server
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// server.js - Replace the CONFIG object at the top
const CONFIG = {
    PORT: process.env.PORT || 3000,
    BATCH_TARGET: parseInt(process.env.BATCH_TARGET) || 50,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    EMAIL_FROM: process.env.EMAIL_FROM || '"D.E.T" <gozieezeh2005@gmail.com>'
};

// Email setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: CONFIG.EMAIL_USER,
        pass: CONFIG.EMAIL_PASS
    }
});

const DATA_FILES = {
    contacts: path.join(__dirname, 'contacts.json'),
    batches: path.join(__dirname, 'batches.json')
};

// Initialize files
const initializeFiles = async () => {
    const defaultData = {
        currentBatch: {
            id: "DET-BATCH-001",
            name: "D.E.T Launch Batch",
            target: CONFIG.BATCH_TARGET,
            current: 0,
            status: "ACTIVE",
            startDate: new Date().toISOString(),
            contacts: []
        },
        allContacts: [],
        completedBatches: []
    };

    try {
        await fs.writeFile(DATA_FILES.batches, JSON.stringify(defaultData, null, 2));
        await fs.writeFile(DATA_FILES.contacts, JSON.stringify([], null, 2));
        console.log('✅ Data files initialized');
    } catch (error) {
        console.error('Error initializing files:', error);
    }
};

// Generate VCF content (ONLY NAME + PHONE)
const generateVCF = (contacts) => {
    let vcfContent = "";
    
    contacts.forEach(contact => {
        vcfContent += `BEGIN:VCARD\n`;
        vcfContent += `VERSION:3.0\n`;
        vcfContent += `FN:${contact.fullName}\n`;
        vcfContent += `TEL;TYPE=CELL:${contact.phone}\n`;
        vcfContent += `NOTE:From D.E.T Contact Gain Batch\n`;
        vcfContent += `END:VCARD\n\n`;
    });
    
    return vcfContent;
};

// Send VCF via email
const sendVCFEmail = async (email, vcfContent, batchId) => {
    try {
        const mailOptions = {
            from: CONFIG.EMAIL_FROM,
            to: email,
            subject: `D.E.T Contact Gain - VCF File for Batch ${batchId}`,
            text: `Hello!\n\nYour VCF contact file for D.E.T Contact Gain Batch ${batchId} is attached.\n\nSimply tap/click the .vcf file to import all contacts to your phone.\n\n- D.E.T Contact Gain Team`,
            attachments: [{
                filename: `DET_Contacts_Batch_${batchId}.vcf`,
                content: vcfContent,
                contentType: 'text/vcard'
            }]
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ VCF sent to ${email}`);
        return true;
    } catch (error) {
        console.error('❌ Email error:', error);
        return false;
    }
};

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Get current batch stats
app.get('/api/stats', async (req, res) => {
    try {
        const data = JSON.parse(await fs.readFile(DATA_FILES.batches, 'utf8'));
        res.json({
            success: true,
            batch: data.currentBatch
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to load stats' });
    }
});

// Submit new contact
app.post('/api/contacts', async (req, res) => {
    try {
        const { fullName, phone, email } = req.body;
        
        // Basic validation
        if (!fullName || !phone || !email) {
            return res.status(400).json({ 
                success: false, 
                error: 'All fields are required' 
            });
        }
        
        // Read current data
        const batchesData = JSON.parse(await fs.readFile(DATA_FILES.batches, 'utf8'));
        const contactsData = JSON.parse(await fs.readFile(DATA_FILES.contacts, 'utf8'));
        
        // Check if batch is full
        if (batchesData.currentBatch.current >= CONFIG.BATCH_TARGET) {
            return res.status(400).json({ 
                success: false, 
                error: 'Batch is full! Please wait for next batch.' 
            });
        }
        
        // Check duplicate email in current batch
        const duplicate = batchesData.currentBatch.contacts.find(c => c.email === email);
        if (duplicate) {
            return res.status(400).json({ 
                success: false, 
                error: 'This email is already in the current batch' 
            });
        }
        
        // Create contact
        const contactId = Date.now().toString();
        const newContact = {
            id: contactId,
            fullName,
            phone,
            email,
            batchId: batchesData.currentBatch.id,
            joinedAt: new Date().toISOString(),
            vcfSent: false
        };
        
        // Add to contacts
        contactsData.push(newContact);
        batchesData.allContacts.push(newContact);
        
        // Add to batch
        batchesData.currentBatch.contacts.push({
            id: contactId,
            email,
            name: fullName
        });
        
        // Update count
        batchesData.currentBatch.current++;
        
        // Check if batch is now complete
        let batchComplete = false;
        if (batchesData.currentBatch.current >= CONFIG.BATCH_TARGET) {
            batchComplete = true;
            batchesData.currentBatch.status = 'COMPLETED';
            batchesData.currentBatch.completedAt = new Date().toISOString();
            
            // Get all contacts in this batch
            const batchContacts = contactsData.filter(c => c.batchId === batchesData.currentBatch.id);
            
            // Generate VCF
            const vcfContent = generateVCF(batchContacts);
            
            // Send VCF to ALL participants in batch
            const emailPromises = batchContacts.map(contact => 
                sendVCFEmail(contact.email, vcfContent, batchesData.currentBatch.id)
            );
            
            // Update sent status
            batchContacts.forEach(contact => {
                contact.vcfSent = true;
                contact.vcfSentAt = new Date().toISOString();
            });
            
            // Move to completed
            batchesData.completedBatches.push(batchesData.currentBatch);
            
            // Start new batch
            const newBatchNum = batchesData.completedBatches.length + 1;
            batchesData.currentBatch = {
                id: `DET-BATCH-${newBatchNum.toString().padStart(3, '0')}`,
                name: `D.E.T Batch ${newBatchNum}`,
                target: CONFIG.BATCH_TARGET,
                current: 0,
                status: "ACTIVE",
                startDate: new Date().toISOString(),
                contacts: []
            };
            
            console.log(`🎉 Batch completed! VCF files sent to ${batchContacts.length} participants.`);
        }
        
        // Save data
        await fs.writeFile(DATA_FILES.batches, JSON.stringify(batchesData, null, 2));
        await fs.writeFile(DATA_FILES.contacts, JSON.stringify(contactsData, null, 2));
        
        res.json({
            success: true,
            message: batchComplete ? 
                '✅ Contact added! Batch complete! VCF files being sent to all participants.' : 
                '✅ Contact added successfully!',
            batchComplete,
            stats: {
                current: batchesData.currentBatch.current,
                target: CONFIG.BATCH_TARGET,
                remaining: CONFIG.BATCH_TARGET - batchesData.currentBatch.current
            }
        });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Test email route (optional)
app.post('/api/test-email', async (req, res) => {
    const { email } = req.body;
    
    try {
        const mailOptions = {
            from: CONFIG.EMAIL_FROM,
            to: email,
            subject: 'D.E.T Contact Gain - Test Email',
            text: 'This is a test email from D.E.T Contact Gain system.'
        };
        
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Test email sent!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Initialize and start server
const startServer = async () => {
    try {
        await fs.access(DATA_FILES.batches);
    } catch {
        await initializeFiles();
    }
    
    app.listen(CONFIG.PORT, () => {
        console.log(`
        🚀 D.E.T CONTACT GAIN Server Started!
        ──────────────────────────────────
        📍 Port: ${CONFIG.PORT}
        🎯 Batch Target: ${CONFIG.BATCH_TARGET}
        📧 Email Ready: ${CONFIG.EMAIL_USER ? 'YES' : 'NO'}
        ──────────────────────────────────
        ⚠️  To enable email sending:
        1. Update EMAIL_USER and EMAIL_PASS in server.js
        2. Use Gmail App Password (not regular password)
        `);
    });
};

startServer();