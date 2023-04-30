# Localization of Just Noticeable Difference for Image Compression

#### **This paper has been accepted by QoMEX 2023 and will be published soon.**

Visit the conference website at: https://sites.google.com/view/qomex2023


**Abstract**

The just noticeable difference (JND) is the minimal difference between stimuli that can be detected by a person. The picture-wise just noticeable difference (PJND) for a given reference image and a compression algorithm represents the minimal level of compression that causes noticeable differences in the reconstruction. 
These differences can only be observed in some specific regions within the image, dubbed as JND-critical regions. Identifying these regions can improve the development of image compression algorithms. Due to the fact that visual perception varies among individuals, determining the PJND values and JND-critical regions for a target population of consumers requires subjective assessment experiments involving a sufficiently large number of observers. 
In this paper, we propose a novel framework for conducting such experiments using crowdsourcing. By applying this framework, we created a novel PJND dataset, KonJND++, consisting of 300 source images, compressed versions thereof under JPEG or BPG compression, and an average of 43 ratings of PJND and 129 self-reported locations of JND-critical regions for each source image.
Our experiments demonstrate the effectiveness and reliability of our proposed framework, which is easy to be adapted for collecting a large-scale dataset.


**Offline demo**

An offline demo can be found in the ./demo folder. To run the demo, please open the HTML file using Chrome. Note that you will receive an error message "There was a problem submitting your results for this HIT." when you attempt to submit the results. This is because the demo is not run in AMT.


**Using the code**

To start using the code, navigate to the main.js file located in the ./src directory and the Configuration.js file in the ./src/components. Refer to lines 215-227 in the ./demo/offline_demo.html file for information on how to organize images and ground truth. The GUI status is stored in the local storage of the browser. To clear the local storage, press F12 and go to the "Application" tab, then clear the stored values.


**Useful resources for using AMT**

- https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/mturk.html
- https://github.com/jcjohnson/simple-amt
- https://github.com/jtjacques/mturk-manage